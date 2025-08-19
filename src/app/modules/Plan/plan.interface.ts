import { Document, Types } from "mongoose";

// Interface for Plan document (TypeScript safe)
export interface IPlan extends Document {
  planName: string;                            // plan name
  amount: number;                              // USD
  currency: string;                            // e.g., "USD"
  interval: "day" | "week" | "month" | "year"; // billing interval
  intervalCount: number;                        // number of intervals
  freeTrialDays?: number;                       // optional free trial
  productId: string;                            // Stripe product ID
  priceId: string;                              // Stripe price ID
  active: boolean;                              // plan is active or not
  description?: string;                         // optional description
  features?: Record<string, any>;              // JSON object for features
  Subscription?: Types.ObjectId[];             // references to Subscription documents
  createdAt: Date;
  updatedAt: Date;
}
