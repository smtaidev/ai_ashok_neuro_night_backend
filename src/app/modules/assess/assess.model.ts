
import { Schema, model } from "mongoose";

// Trend Schema
const trendSchema = new Schema({
  trendName: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  impactLevel: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
});

// SWOT Schema
const swotSchema = new Schema({
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  opportunities: { type: [String], default: [] },
  threats: { type: [String], default: [] },
});

// Challenge Schema
const challengeSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  impactOnBusiness: { type: String, required: true },
  abilityToAddress: { type: String, required: true },
  description: { type: String, required: true },
});

// Competitor Analysis Schema
const competitorAnalysisSchema = new Schema({
  name: { type: String, required: true },
  companyUrl: { type: String, required: true },
  stockSymbol: { type: String, required: true },
  twitterLink: { type: String, required: true },
  linkedinLink: { type: String, required: true },
  instagramLink: { type: String, required: true },
  glassdoorLink: { type: String, required: true },
});

// Clarhet Recommendation Schema
const clarhetRecommendationSchema = new Schema({
  onChallenges: { type: String, required: true },
  onTrends: { type: String, required: true },
  onSwot: { type: String, required: true },
  onCA: { type: String, required: true },
});

// Main Assess Schema
const assessSchema = new Schema(
  {
    companyName: { type: String, required: true }, // You can change it to ObjectId if needed
    trends: { type: [trendSchema], default: [] },
    swot: { type: swotSchema, required: true },
    challenges: { type: [challengeSchema], default: [] },
    competitorAnalysis: { type: competitorAnalysisSchema, required: true },
    clarhetRecommendation: { type: clarhetRecommendationSchema, required: true },
    alignmentCheckId: { type: String, default:null },
  },
  {
    timestamps: true,
  }
);

// Model export
const AssessModel = model("assess", assessSchema);
export default AssessModel;
