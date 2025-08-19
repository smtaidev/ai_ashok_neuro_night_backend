import mongoose from "mongoose";
import Stripe from "stripe";
import status from "http-status";
import AppError from "../errors/AppError";
import { Subscription } from "../modules/Subscription/Subscription.model";
import UserModel from "../modules/user/user.model";
import { ISubscription } from "../modules/Subscription/Subscription.interface";


// Helper function to calculate end date based on plan interval
const calculateEndDate = (
  startDate: Date,
  interval: string,
  intervalCount: number
): Date => {
  const endDate = new Date(startDate);

  switch (interval) {
    case "day":
      endDate.setDate(endDate.getDate() + intervalCount);
      break;
    case "week":
      endDate.setDate(endDate.getDate() + 7 * intervalCount);
      break;
    case "month":
      endDate.setMonth(endDate.getMonth() + intervalCount);
      if (endDate.getDate() !== startDate.getDate()) {
        endDate.setDate(0);
      }
      break;
    case "year":
      endDate.setFullYear(endDate.getFullYear() + intervalCount);
      break;
    default:
      throw new AppError(
        status.BAD_REQUEST,
        `Unsupported interval: ${interval}`
      );
  }

  return endDate;
};

// Payment succeeded handler
const handlePaymentIntentSucceeded = async (paymentIntent: Stripe.PaymentIntent) => {
  // Find subscription by stripePaymentId and populate plan
  const payment = await Subscription.findOne({ stripePaymentId: paymentIntent.id }).populate("planId") as ISubscription

  if (!payment) {
    throw new AppError(
      status.NOT_FOUND,
      `Payment not found for ID: ${paymentIntent.id}`
    );
  }

  if (!payment.plan) {
    throw new AppError(
      status.NOT_FOUND,
      "Plan not found for this subscription"
    );
  }

  if (paymentIntent.status !== "succeeded") {
    throw new AppError(
      status.BAD_REQUEST,
      "Payment intent is not in succeeded state"
    );
  }

  const startDate = new Date();
  const endDate = calculateEndDate(startDate, payment.plan.interval, payment.plan.intervalCount);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update user
    await UserModel.updateOne(
      { _id: payment.userId },
      { $set: { isSubscribed: true, planExpiration: endDate } },
      { session }
    );

    // Update subscription
    await Subscription.updateOne(
      { _id: payment._id },
      { $set: { paymentStatus: "COMPLETED", startDate, endDate } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Payment failed handler
const handlePaymentIntentFailed = async (paymentIntent: Stripe.PaymentIntent) => {
  const payment = await Subscription.findOne({ stripePaymentId: paymentIntent.id });

  if (!payment) {
    throw new AppError(
      status.NOT_FOUND,
      `Payment not found for ID: ${paymentIntent.id}`
    );
  }

  await Subscription.updateOne(
    { _id: payment._id },
    { $set: { paymentStatus: "CANCELED", endDate: new Date() } }
  );
};

export { handlePaymentIntentSucceeded, handlePaymentIntentFailed };
