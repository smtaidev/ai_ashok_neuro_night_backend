import { model, Schema } from "mongoose";
import { IFoundation } from "./foundation.interface";
// Capability Schema আলাদা করা হলো
const CapabilitySchema = new Schema(
  {
    capability: { type: String, default: null },
    type: { type: String, default: null },
  },
  
);

// Identity Schema
const IdentitySchema = new Schema(
  {
    mission: { type: String, default: null },
    value: { type: String, default: null },
    purpose: { type: String, default: null },
  }
);

// ZeroIn Schema
const ZeroInSchema = new Schema(
  {
    targetCustomer: { type: String, default: null },
    keyCustomerNeed: { type: String, default: null },
    valueProposition: { type: String, default: null },
  }
);

// Main Foundation Schema
const FoundationSchema = new Schema<IFoundation>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    identity: {
      type: IdentitySchema,
      default: {},
    },
    zeroIn: {
      type: ZeroInSchema,
      default: {},
    },
    capabilitys: {
      type: [CapabilitySchema],
      default: [],
    },
    differentiatingCapabilities: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const FoundationModel = model<IFoundation>('Foundation', FoundationSchema);