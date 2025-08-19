import { model, Schema } from "mongoose";
import { ISubscription } from "./Subscription.interface";
// PaymentStatus enum values
const paymentStatusEnum = ['PENDING', 'COMPLETED', 'CANCELED', 'REFUNDED'];

const subscriptionSchema = new Schema <ISubscription>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  planId: {  type: Schema.Types.ObjectId, ref: 'Plan'},
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: null },
  amount: { type: Number, required: true },
  stripePaymentId: { type: String, required: true, unique: true },
  paymentStatus: { type: String, enum: paymentStatusEnum, default: 'PENDING' },
}, {
  timestamps: true // automatically adds createdAt and updatedAt
});

export const Subscription = model('Subscription', subscriptionSchema);

