import { Document, Types } from "mongoose";


// Enum type for paymentStatus
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'CANCELED' | 'REFUNDED';

// Interface for Subscription document
export interface ISubscription extends Document {
  userId: Types.ObjectId
  planId: Types.ObjectId 
  startDate: Date;
  endDate?: Date | null;
  amount: number;
  stripePaymentId: string;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}