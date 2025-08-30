import mongoose from "mongoose";
const InsightSchema = new mongoose.Schema({
 companyId: { type: mongoose.Schema.Types.ObjectId, ref: "competitor-stores",
required: true },
 title: String,
 context: String,
 implication: String,
 urgency: { type: String, enum: ["low","medium","high"], required:
true },
 confidence: { type: String, enum: ["low","medium","high"], required:
true },
 sources: [{ type: { type: String }, url: String, capturedAt:
Date }],
 createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Insight", InsightSchema);