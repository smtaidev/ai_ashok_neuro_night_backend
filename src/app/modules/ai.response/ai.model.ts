import mongoose, { model } from "mongoose";

const SummarySchema = new mongoose.Schema({
  key_opportunities: { type: String, required: true },
  strengths: { type: String, required: true },
  significant_risks: { type: String, required: true },
  challenges: { type: String, required: true },
  strategic_recommendations: { type: String, required: true },
  irrelevant_answers: { type: [String], default: [] }
});

const TrendSynthesisSchema = new mongoose.Schema({
  trend_synthesis: { type: [String], default: [] }
}, { _id: false });

const AiTrendSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  summary: { type: SummarySchema, required: true },
  trend_synthesis: { type: [String], default: [] },
  early_warnings: { type: String, default: '' },
  strategic_opportunities: { type: [String], default: [] },
  analyst_recommendations: { type: String, default: '' },
  radar_executive_summary: { type: [String], default: [] },
  radar_recommendation: { type: [String], default: [] },
  error: { type: mongoose.Schema.Types.Mixed, default: null }
});

export const AiTrendModel=model("AiTrends",AiTrendSchema)