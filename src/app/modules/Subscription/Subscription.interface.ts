import { Document, Types } from "mongoose";
import { IPlan } from "../Plan/plan.interface";


// Enum type for paymentStatus
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'CANCELED' | 'REFUNDED';

// Interface for Subscription document
export interface ISubscription extends Document {
  userId: Types.ObjectId |string
  planId: Types.ObjectId |string
  startDate: Date;
  endDate?: Date | null;
  amount: number;
  stripePaymentId: string;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
   plan?: IPlan
}