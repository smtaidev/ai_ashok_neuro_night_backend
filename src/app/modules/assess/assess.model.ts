import { Schema, model } from "mongoose";

// Trend Item Schema (question, answer, impactLevel)
const trendItemSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  impactLevel: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
});

// Trend Schema (trendName is array of trendItemSchema)
const trendSchema = new Schema({
  trendName: { type: [trendItemSchema], required: true, default: [] },
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
  name: { type: String, default: "" },
  companyUrl: { type: String, default: "" },
  stockSymbol: { type: String, default: "" },
  twitterLink: { type: String, default: "" },
  linkedinLink: { type: String, default: "" },
  instagramLink: { type: String, default: "" },
  glassdoorLink: { type: String, default: "" },
});

// Clarhet Recommendation Schema
const clarhetRecommendationSchema = new Schema({
  onChallenges: { type: String, default: "" },
  onTrends: { type: String, default: "" },
  onSwot: { type: String, default: "" },
  onCA: { type: String, default: "" },
});

// Main Assess Schema
const assessSchema = new Schema(
  {
    companyName: { type: String, required: true },
    trends: { type: [trendSchema], default: [] },
    swot: {
      type: swotSchema,
      required: true,
      default: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
    },
    challenges: { type: [challengeSchema], default: [] },
    competitorAnalysis: {
      type: competitorAnalysisSchema,
      required: true,
      default: {
        name: "",
        companyUrl: "",
        stockSymbol: "",
        twitterLink: "",
        linkedinLink: "",
        instagramLink: "",
        glassdoorLink: "",
      },
    },
    clarhetRecommendation: {
      type: clarhetRecommendationSchema,
      required: true,
      default: { onChallenges: "", onTrends: "", onSwot: "", onCA: "" },
    },
    alignmentCheckId: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

// Export model
const AssessModel = model("assess", assessSchema);
export default AssessModel;
