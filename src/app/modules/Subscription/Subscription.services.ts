
// import status from "http-status";
// import UserModel from "../user/user.model";
// import AppError from "../../errors/AppError";
// import { Plan } from "../Plan/plan.model";
// import { PaymentStatus, Subscription } from "./Subscription.model";
// import { stripe } from "../../utils/stripe";
// import Stripe from "stripe";


// // Create Subscription
// export const createSubscription = async (userId: string, planId: string) => {
//   // 1. Verify user
//   const user = await UserModel.findById(userId);
//   if (!user) throw new AppError(status.NOT_FOUND, "User not found");

//   // 2. Verify plan
//   const plan = await Plan.findById(planId);
//   if (!plan) throw new AppError(status.NOT_FOUND, "Plan not found");

//   // 3. Calculate endDate
//   const startDate = new Date();
//   let endDate: Date | null = null;

//   if (plan.durationInMonths) {
//     endDate = new Date(startDate);
//     endDate.setMonth(endDate.getMonth() + plan.durationInMonths);
//     if (endDate.getDate() !== startDate.getDate()) endDate.setDate(0);
//   }

//   // 4. Create Stripe PaymentIntent
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: Math.round(plan.price * 100), // cents
//     currency: plan.currency || "usd",
//     metadata: {
//       userId: user._id.toString(),
//       planId: plan._id.toString(),
//     },
//     automatic_payment_methods: { enabled: true },
//   });

//   // 5. Handle existing subscription
//   let subscription = await Subscription.findOne({ userId: user._id });

//   if (subscription && subscription.paymentStatus === "PENDING") {
//     subscription.planId = plan._id;
//     subscription.stripePaymentId = paymentIntent.id;
//     subscription.startDate = startDate;
//     subscription.amount = plan.price;
//     subscription.endDate = subscription.endDate || endDate;
//     subscription.paymentStatus = "PENDING";
//     await subscription.save();
//   } else {
//     subscription = await Subscription.create({
//       userId: user._id,
//       planId: plan._id,
//       startDate,
//       amount: plan.price,
//       stripePaymentId: paymentIntent.id,
//       paymentStatus: "PENDING",
//       endDate,
//     });
//   }

//   return {
//     subscription,
//     clientSecret: paymentIntent.client_secret,
//     paymentIntentId: paymentIntent.id,
//   };
// };

// // Get all subscriptions
// export const getAllSubscription = async () => {
//   const subscriptions = await Subscription.find()
//     .populate("user", "fullName email profilePic role isSubscribed planExpiration")
//     .populate("plan");
//   return subscriptions;
// };

// // Get single subscription by ID
// export const getSingleSubscription = async (subscriptionId: string) => {
//   const subscription = await Subscription.findById(subscriptionId)
//     .populate("user", "fullName email profilePic role isSubscribed planExpiration")
//     .populate("plan");

//   if (!subscription)
//     throw new AppError(status.NOT_FOUND, "Subscription not found");
//   return subscription;
// };

// // Get my subscription
// export const getMySubscription = async (userId: string) => {
//   const user = await UserModel.findById(userId);
//   if (!user) throw new AppError(status.NOT_FOUND, "User not found");

//   const subscription = await Subscription.findOne({ userId })
//     .populate("user", "fullName email profilePic role isSubscribed planExpiration")
//     .populate("plan");

//   if (!subscription)
//     throw new AppError(status.NOT_FOUND, "Subscription not found");

//   return subscription;
// };

// // Update subscription
// export const updateSubscription = async (
//   subscriptionId: string,
//   data: Partial<typeof Subscription>
// ) => {
//   const subscription = await Subscription.findByIdAndUpdate(subscriptionId, data, {
//     new: true,
//   });
//   if (!subscription)
//     throw new AppError(status.NOT_FOUND, "Subscription not found");
//   return subscription;
// };

// // Delete subscription
// export const deleteSubscription = async (subscriptionId: string) => {
//   const subscription = await Subscription.findByIdAndDelete(subscriptionId);
//   if (!subscription)
//     throw new AppError(status.NOT_FOUND, "Subscription not found");
//   return subscription;
// };


// // Webhook handler
// export const handleStripeWebhook = async (event: Stripe.Event) => {
//   try {
//     switch (event.type) {
//       case "payment_intent.succeeded": {
//         const paymentIntent = event.data.object as Stripe.PaymentIntent;

//         // 1. Find subscription by Stripe payment ID
//         const subscription = await Subscription.findOne({
//           stripePaymentId: paymentIntent.id,
//         });
//         if (!subscription) throw new AppError(status.NOT_FOUND, "Subscription not found");

//         // 2. Update subscription status
//         subscription.paymentStatus = PaymentStatus.SUCCEEDED;
//         subscription.startDate = new Date(); // Optional: update startDate if needed
//         subscription.endDate = subscription.endDate || new Date(); // Optional
//         await subscription.save();

//         console.log("Payment succeeded for subscription:", subscription._id);
//         break;
//       }

//       case "payment_intent.payment_failed": {
//         const paymentIntent = event.data.object as Stripe.PaymentIntent;

//         const subscription = await Subscription.findOne({
//           stripePaymentId: paymentIntent.id,
//         });
//         if (!subscription) throw new AppError(status.NOT_FOUND, "Subscription not found");

//         subscription.paymentStatus = PaymentStatus.FAILED;
//         await subscription.save();

//         console.log("Payment failed for subscription:", subscription._id);
//         break;
//       }

//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }

//     return { received: true };
//   } catch (error) {
//     console.error("Error handling Stripe webhook:", error);
//     throw new AppError(status.INTERNAL_SERVER_ERROR, "Webhook handling failed");
//   }
// };
