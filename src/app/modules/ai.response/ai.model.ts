import mongoose, { model, Schema } from "mongoose";

const SummarySchema = new mongoose.Schema({
  key_opportunities: { type: String, required: true },
  strengths: { type: String, required: true },
  significant_risks: { type: String, required: true },
  challenges: { type: String, required: true },
  strategic_recommendations: { type: String, required: true },
  irrelevant_answers: { type: [String], default: [] },
});

const TrendSynthesisSchema = new mongoose.Schema(
  {
    trend_synthesis: { type: [String], default: [] },
  },
  { _id: false }
);

const AiTrendSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  summary: { type: SummarySchema, required: true },
  trend_synthesis: { type: [String], default: [] },
  early_warnings: { type: String, default: "" },
  strategic_opportunities: { type: [String], default: [] },
  analyst_recommendations: { type: String, default: "" },
  radar_executive_summary: { type: [String], default: [] },
  radar_recommendation: { type: [String], default: [] },
  error: { type: mongoose.Schema.Types.Mixed, default: null },
});

export const AiTrendModel = model("AiTrends", AiTrendSchema);

const scoreItemSchema = new Schema(
  {
    value: { type: Number, required: false },
    rationale: { type: String, required: false },
  },
  { _id: false }
);

const analysisSchema = new Schema({
  companyName: { type: String, required: true },
  scores: {
    strengths: { type: scoreItemSchema, required: false },
    weaknesses: { type: scoreItemSchema, required: false },
    opportunities: { type: scoreItemSchema, required: false },
    threats: { type: scoreItemSchema, required: false },
  },
  recommendations: {
    strengths: { type: [String], default: null },
    weaknesses: { type: [String], default: null },
    opportunities: { type: [String], default: null },
    threats: { type: [String], default: null },
  },
  error: { type: String, default: null },
});

export const AnalysisModel = model("Analysis", analysisSchema);

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  impact_on_business: {
    type: String,
    enum: ["very low", "low", "moderate", "high", "very high"],
    required: true,
  },
  ability_to_address: {
    type: String,
    enum: ["very low", "low", "moderate", "high", "very high"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  risk_score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

const RiskMainSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  challenge: {
    type: [ChallengeSchema],
    required: true,
    default: [],
  },
  // You can add trends, swot, etc. here as needed
});

export const RiskModel = mongoose.model("RiskScore", RiskMainSchema);

const recommendationsSchema = new Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  recommendations: {
    type: String,
    default: "",
  },
});

export const AiRecommendModel = model("recommends", recommendationsSchema);

const VisionAssessmentSchema = new mongoose.Schema(
  {
    companyName: { type: String, require: true },
    vision_score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    vision_summary: {
      type: String,
      required: true,
      trim: true,
    },
    vision_recommendations: {
      type: [String],
      required: true,
    },
    vision_alt: {
      type: [String],
      required: true,
    },
    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export const  VisionAssessmentModel = mongoose.model("VisionAssessment", VisionAssessmentSchema);
