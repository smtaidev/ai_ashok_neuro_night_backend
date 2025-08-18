import { Schema, model, Document } from "mongoose";

// Interface (TypeScript optional)
export interface IPlan extends Document {
  name: "Basic" | "Standard" | "Premium";
  price: number;
  durationInMonths: number;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const planSchema = new Schema<IPlan>(
  {
    name: {
      type: String,
      required: true,
      enum: ["Basic", "Standard", "Premium"], // fixed options
    },
    price: {
      type: Number,
      required: true,
      min: 0, // negative price prevent
    },
    durationInMonths: {
      type: Number,
      required: true,
      min: 1, // minimum 1 month
    },
    features: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Model
export const Plan = model<IPlan>("Plan", planSchema);
