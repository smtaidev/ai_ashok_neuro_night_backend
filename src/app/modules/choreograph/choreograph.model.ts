import mongoose, { Schema } from "mongoose";

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
    teamName: { type: String, required: true },
    headcount: { type: Number, required: true },
    teamAllocation: { type: String, required: true },
    teamAvailability: {
      type: String,
      enum: ["available", "busy", "partial"],
      required: true,
    },
    talentNeed: { type: String, required: true },
    skillNeed: { type: [String], required: true },
   members: {
  type: [memberSchema],
  default: null,
},

  },
  { timestamps: true }
);

// ---------- Objective ----------
export const objectiveSchema = new Schema(
  {
    title: { type: String, required: true },
    priorityLevel: { type: String, enum: ["low", "medium", "high"], required: true },
    department: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    completeness: { type: Number, min: 0, max: 100, required: true },
    talent: { type: String, required: true },
    challengesAndRollbacks: { type: String, required: true },
    risk: { type: String, required: true },
    envAndSocial: { type: String, required: true },
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
