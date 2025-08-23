import mongoose from "mongoose";

const talentOverviewSchema = new mongoose.Schema(
  { 
    companyName:{ type: String ,required:true},
    talent:{ type: String ,required:true},
    function: { type: String ,required:true},
    identifiedSkillsGaps: { type: String ,required:true},
    priorityForFillingGaps: { type: String ,required:true},
    trainingAndDevelopmentNeeds: { type: String,required:true },
    marketTrendsAffectingWorkforce: { type: String ,required:true},
    talentShortageRisks: { type: String ,required:true},
    regulatoryChanges: { type: String ,required:true},
    otherTalentRelatedRisks: { type: String,required:true },
    summary: { type: String,required:true },
    actionItems: { type: String,required:true },
  },
  { timestamps: true }
);

export const TalentOverview = mongoose.model(
  "talent-overview",
  talentOverviewSchema
);
