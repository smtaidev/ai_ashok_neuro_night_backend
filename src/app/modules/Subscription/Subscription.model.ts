import mongoose, { Schema, model, Document } from "mongoose";

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
}

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate?: Date | null; // <-- null allow করা হলো
  amount: number;
  stripePaymentId: string;
  paymentStatus:"PENDING"|"SUCCEEDED"|"FAILED",
}
const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date ,
    },
    amount: {
      type: Number,
      required: true,
    },
    stripePaymentId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
  },
  { timestamps: true, collection: "subscriptions" }
);

export const Subscription = model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
