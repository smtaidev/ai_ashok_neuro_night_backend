import mongoose, { Schema, Types } from "mongoose";

// ---------- Member ----------
export const memberSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    skills: { type: [String], required: true },
    allocation: { type: String, required: true },
  },
  { timestamps: true }
);

// ---------- Team ----------
export const teamSchema = new Schema(
  {
    teamName: { type: String, required: true ,unique:true},
    headcount: { type: Number, required: true },
    description:{ type: String, required: true },
    // teamAllocation: { type: String, required: true },
    // teamAvailability: {
    //   type: String,
    //   enum: ["available", "busy", "partial"],
    //   required: true,
    // },
    // talentNeed: { type: String, required: true },
    // skillNeed: { type: [String], required: true },
   members: {
  type: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization-User", 
  }],
  default: [],
},

  },
  { timestamps: true }
);

// ---------- Objective ----------
export const objectiveSchema = new Schema(
  {
   
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    priority: { 
      type: String, 
      required: true,
      enum: ["Urgent", "High", "Medium", "Low"] 
    },
    progress: { type: String, required: true },
    fundingAllocated: { type: String, required: true },
    envSocialIssues: { type: String, required: true },
    envSocialDetails: { type: String, required: true },
    risksAssociated: { type: String, required: true },
    riskDetails: { type: String, required: true },

    // ObjectId fields
    objectiveOwner: { type: Types.ObjectId, ref: "Organization-User", required: true },
    assignedTeamMembers: { type: Types.ObjectId, ref: "Organization-User", required: true },
    invitedTeamMembers: { type: Types.ObjectId, ref: "Organization-User", required: true },

    crossTeamCollaboration: { type: String, required: true },
    businessGoals:{ type: Types.ObjectId, ref:"Blueprint", required: true },
    termType: { type: String, required: true },
    specificStrategic: { type: String, required: true },
    necessaryResources: { type: String, required: true },
    additionalTalent: { type: String, required: true },
    potentialChallenges: { type: String, required: true },
  },
  { timestamps: true }
);

// ---------- Choreograph ----------
export const choreographSchema = new Schema(
  {
    companyName: { type: String, required: true }, // FK to Company (_id string)
    objectives: { type: [objectiveSchema], default: []},
    teams: { type: [teamSchema], default: [] },
    alignmentCheckId: { type: String, default: null }, // FK to AlignmentCheck
  },
  { timestamps: true }
);

export default mongoose.model("Choreograph", choreographSchema);
