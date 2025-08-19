const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const planSchema = new Schema(
  {
    planName: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    interval: { type: String, enum: ['day', 'week', 'month', 'year'], default: 'month' },
    intervalCount: { type: Number, required: true },
    freeTrialDays: { type: Number, default: 0 },
    productId: { type: String, required: true },
    priceId: { type: String, required: true },
    active: { type: Boolean, default: true },
    description: { type: String, default: '' },
    features: { type: Schema.Types.Mixed, default: {} }, // JSON type
    Subscription: [{ type: Schema.Types.ObjectId, ref: 'Subscription' }],
  },
  { timestamps: true } // createdAt & updatedAt
);

export const PlanModel = model('Plan', planSchema, 'plans'); // 'plans' collection explicitly


