
import { Schema, model } from "mongoose";

const planSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["Basic", "Standard", "Premium"], 
    },
    price: {
      type: Number,
      required: true, 
    },
    currency: {
      type: String,
      default: "USD", 
    },
    durationInMonths: {
      type: Number,
      required: true, 
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

export const Plan = model("Plan", planSchema);

