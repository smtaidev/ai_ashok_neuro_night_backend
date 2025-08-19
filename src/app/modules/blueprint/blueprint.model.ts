import { model, Schema } from "mongoose";
import { v4 } from "uuid";


const StrategicThemeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
});





// const ImpactRatingsSchema = new Schema({
//   risks: { type: String, enum: ["High", "Medium", "Low"], required: true },
//   compliance: { type: String, enum: ["High", "Medium", "Low"], required: true },
//   culture: { type: String, enum: ["High", "Medium", "Low"], required: true },
//   change_management: { type: String, enum: ["High", "Medium", "Low"], required: true },
//   l_and_d: { type: String, enum: ["High", "Medium", "Low"], required: true },
//   capabilities: { type: String, enum: ["High", "Medium", "Low"], required: true },
// });

// const BusinessGoalSchema = new Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   related_strategic_theme: { type: String, required: true },
//   priority: { type: String, enum: ["High", "Medium", "Low"], required: true },
//   resource_readiness: { type: String, enum: ["Yes", "No"], required: true },
//   assigned_functions: { type: [String], required: true },
//   duration: { type: String, enum: ["Short-term", "Medium-term", "Long-term"], required: true },
//   impact_ratings: { type: ImpactRatingsSchema, required: true },
//   esg_issues: { type: String, enum: ["Yes", "No"], required: true },
//   new_capabilities_needed: { type: String, enum: ["Yes", "No"], required: true },
//   existing_capabilities_to_enhance: { type: String, enum: ["Yes", "No"], required: true },
// }, { timestamps: true });


const ImpactRatingsSchema = new Schema({
  risks: { type: String, enum: ["High", "Medium", "Low"], required: true },
  compliance: { type: String, enum: ["High", "Medium", "Low"], required: true },
  culture: { type: String, enum: ["High", "Medium", "Low"], required: true },
  change_management: { type: String, enum: ["High", "Medium", "Low"], required: true },
  l_and_d: { type: String, enum: ["High", "Medium", "Low"], required: true },
  capabilities: { type: String, enum: ["High", "Medium", "Low"], required: true }
});

const BusinessGoalSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  related_strategic_theme: { type: String, required: true },
  priority: { type: String, enum: ["High", "Medium", "Low"], required: true },
  resource_readiness: { type: String, enum: ["Yes", "No"], required: true },
  assigned_functions: { type: [String], required: true },
  duration: { type: String, enum: ["Short-term", "Medium-term", "Long-term"], required: true },
  impact_ratings: { type: ImpactRatingsSchema, required: true },
  esg_issues: { type: String, enum: ["Yes", "No"], required: true },
  new_capabilities_needed: { type: String, enum: ["Yes", "No"], required: true },
  existing_capabilities_to_enhance: { type: String, enum: ["Yes", "No"], required: true },

  // ✅ Extra fields from your JSON data
  capabilityDescription: { type: String },
  capabilityEnhancement: { type: String },
  capabilityInfluenced: { type: [String], default: [] },
  capabilityOwners: { type: [String], default: [] },
  capabilityType: { type: String },
  changeTransformation: { type: String },
  culturalRealignment: { type: String },
  enhancementDetails: { type: String },
  environmentalIssuesDetails: { type: String },
  funding: { type: Number },
  goalOwner: { type: [String], default: [] },
  goalProgress: { type: Number },
  goalTimelineEnd: { type: Date },
  goalTimelineStart: { type: Date },
  goal_impact: { type: String, enum: ["High", "Medium", "Low"] },
  hasTalent: { type: String, enum: ["Yes", "No"] },
  isSpecificStrategic: { type: String, enum: ["Yes", "No"] },
  newCapabilityName: { type: String },
  otherDetails: { type: String },
  regulatoryCompliance: { type: String },
  resourcesDetails: { type: String },
  risksChallenges: { type: String },
  talentDetails: { type: String }
})

const BlueprintSchema = new Schema({
  companyName: { type: String, required: true }, // assuming Company collection
  vision: { type: String, default: "" },
  strategicThemes: { type: [StrategicThemeSchema], default: [] },
  businessGoals: { type: [BusinessGoalSchema], default: [] }
}, { timestamps: true });

export const BlueprintModel = model('Blueprint', BlueprintSchema);
