import { Schema, model } from "mongoose";

// Trend Detail Schema (for questions inside Trend)
const trendDetailSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  impactLevel: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
});

// Trend Schema
const trendSchema = new Schema({
  trendName: { type: String, required: true },
  trendDetails: { type: [trendDetailSchema], default: [] },
});

// SWOT Schema
const detailSchema = new Schema({
  details: { type: String, required: true },
});

const swotSchema = new Schema({
  strengths: { type: [detailSchema], default: [] },
  weaknesses: { type: [detailSchema], default: [] },
  opportunities: { type: [detailSchema], default: [] },
  threats: { type: [detailSchema], default: [] },
});

// Challenge Schema
const challengeSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  impact_on_business: { type: String, required: true },
  ability_to_address: { type: String, required: true },
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
      type: [swotSchema],        
      required: true,
      default: [],              
    },
    challenges: { type: [challengeSchema], default: [] },
    competitorAnalysis: { type: [competitorAnalysisSchema], required: true },
    clarhetRecommendation: {
      type: [clarhetRecommendationSchema],
      required: true,
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
