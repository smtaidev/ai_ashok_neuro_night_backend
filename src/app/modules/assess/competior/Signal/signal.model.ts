import mongoose from "mongoose";
const SignalSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "competitor-stores",
    required: true,
  },
  source: {
    type: String,
    enum: ["job_postings", "patents", "filings", "reviews", "news"],
    required: true,
  },
  title: String,
  description: String,
  url: String,
  data: Object,
  capturedAt: { type: Date, default: Date.now },
});
SignalSchema.index({ companyId: 1, source: 1, url: 1 }, { unique: true });
export default mongoose.model("Signal", SignalSchema);
