import { Schema, model } from 'mongoose';
import { IFoundation } from './foundation.interface'; 

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
      mission: { type: String},
      value: { type: String},
      purpose: { type: String},
    },
    zeroIn: {
      targetCustomer: { type: String},
      keyCustomerNeed: { type: String},
      valueProposition: { type: String},
    },
    capability: {
      coreCapabilities: { type: [String]},
      differentiatingCapabilities: { type: [String]},
    },
  },
  {
    timestamps: true,
  }
);

export const FoundationModel = model<IFoundation>('Foundation', FoundationSchema);
