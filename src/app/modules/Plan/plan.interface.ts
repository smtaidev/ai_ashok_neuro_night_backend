import { Document } from "mongoose";

export interface IPlan extends Document {
  name: "Basic" | "Standard" | "Premium";
  price: number;           // USD
  currency?: string;       // default: "USD"
  durationInMonths: number;
  features?: string[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
