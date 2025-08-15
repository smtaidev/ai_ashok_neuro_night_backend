import { model, Schema } from "mongoose";
import { IFoundation } from "./foundation.interface";

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
      mission: { type: String, default: null },
      value: { type: String, default: null },
      purpose: { type: String, default: null },
    },
    zeroIn: {
      targetCustomer: { type: String, default: null },
      keyCustomerNeed: { type: String, default: null },
      valueProposition: { type: String, default: null },
    },
  capabilitys: {
  type: [
    new Schema(
      {
        _id:{type: String, },
        capability: { type: String, default: null },
        type: { type: String, default: null }
      },
      
    )
  ],
  default: []
},
    differentiatingCapabilities: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export const FoundationModel = model<IFoundation>('Foundation', FoundationSchema);