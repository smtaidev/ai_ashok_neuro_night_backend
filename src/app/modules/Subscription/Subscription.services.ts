
import Stripe from "stripe";
import status from "http-status";
import { stripe } from "../../utils/stripe";
import AppError from "../../errors/AppError";
import UserModel from "../user/user.model";
import { PlanModel } from "../Plan/plan.model";
import { Subscription } from "./Subscription.model";
import { handlePaymentIntentFailed, handlePaymentIntentSucceeded } from "../../utils/webhook";
import { ISubscription } from "./Subscription.interface";

const createSubscription = async (userId :string , planId:string) => {
  // 1. Verify user exists
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError(status.NOT_FOUND, "User not found");

  // 2. Verify plan exists
  const plan = await PlanModel.findById(planId);
  if (!plan) throw new AppError(status.NOT_FOUND, "Plan not found");

  // 3. Calculate end date based on plan interval
  const startDate = new Date();
  let endDate: Date | null = null;

  if (plan.interval === "month") {
    endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + (plan.intervalCount || 1));
    if (endDate.getDate() !== startDate.getDate()) endDate.setDate(0);
  }
  // Add day, week, year as needed

  // 4. Create payment intent in Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(plan.amount * 100),
    currency: "usd",
    metadata: { userId: user.id, planId },
    automatic_payment_methods: { enabled: true },
  });

  // 5. Handle existing subscription
  let subscription = await Subscription.findOne({ userId: user.id }) as ISubscription

  if (subscription?.paymentStatus === "PENDING") {
    subscription.planId = planId ;
    subscription.stripePaymentId = paymentIntent.id;
    subscription.startDate = startDate;
    subscription.amount = plan.amount;
    subscription.endDate = subscription.endDate || endDate;
    subscription.paymentStatus = "PENDING";
    await subscription.save();
  } else {
    subscription = await Subscription.create({
      userId: user.id,
      planId,
      startDate,
      endDate,
      amount: plan.amount,
      stripePaymentId: paymentIntent.id,
      paymentStatus: "PENDING",
    });
  }

  return {
    subscription,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
};

const getAllSubscription = async (query: Record<string, any>) => {
  const subscriptions = await Subscription.find(query)
    .populate("user", "id fullName email profilePic role isSubscribed planExpiration")
    .populate("plan")
    .exec();

  return { meta: { total: subscriptions.length }, data: subscriptions };
};

const getSingleSubscription = async (subscriptionId: string) => {
  const subscription = await Subscription.findById(subscriptionId)
    .populate("user", "id fullName email profilePic role isSubscribed planExpiration")
    .populate("plan")
    .exec();

  if (!subscription) throw new AppError(status.NOT_FOUND, "Subscription not found!");

  return subscription;
};

const getMySubscription = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError(status.NOT_FOUND, "User not found");

  const subscription = await Subscription.findOne({ userId: user.id })
    .populate("userId", "id fullName email profilePic role isSubscribed planExpiration")
    .populate("planId")
    .exec();

  if (!subscription) throw new AppError(status.NOT_FOUND, "Subscription not found!");

  return subscription;
};

const updateSubscription = async (subscriptionId: string, data: Partial<typeof Subscription>) => {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new AppError(status.NOT_FOUND, "Subscription not found");

  Object.assign(subscription, data);
  await subscription.save();
  return subscription;
};

const deleteSubscription = async (subscriptionId: string) => {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new AppError(status.NOT_FOUND, "Subscription not found");

  await subscription.deleteOne();
  return null;
};

const HandleStripeWebhook = async (event: Stripe.Event) => {
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return { received: true };
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Webhook handling failed");
  }
};

export const SubscriptionServices = {
  getMySubscription,
  createSubscription,
  getAllSubscription,
  updateSubscription,
  deleteSubscription,
  HandleStripeWebhook,
  getSingleSubscription,
};
