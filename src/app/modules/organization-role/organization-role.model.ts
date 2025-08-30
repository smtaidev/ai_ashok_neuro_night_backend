import mongoose, { model } from "mongoose";
import { IOrganizationUser } from "./organization-role.interface";
import { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "Organization-User" },
    name: { type: String, required: false },
    email: { type: String, required: false },
    businessFunction: { type: String, required: true },
    notes: { type: String, required: true },
    companyName: { type: String, required: true },

    foundations: {
      type: String,
      enum: ["edit", "view", "hidden"],
      default: "hidden",
    },
    trends: {
      type: String,
      enum: ["edit", "view", "hidden"],
      default: "hidden",
    },
    swot: { type: String, enum: ["edit", "view", "hidden"], default: "hidden" },
    challenges: {
      type: String,
      enum: ["edit", "view", "hidden"],
      default: "hidden",
    },
    competitorsAnalysis: {
      type: String,
      enum: ["edit", "view", "hidden"],
      default: "hidden",
    },
    clarhetAIRec: {
      type: String,
      enum: ["edit", "view", "hidden"],
      default: "hidden",
    },
    alignment: {
      type: String,
      enum: ["edit", "view", "hidden"],
      default: "hidden",
    },
    vision: {
      type: String,
      enum: ["edit", "view", "hidden"],
      default: "hidden",
    },
    themes: {
      type: String,
      enum: ["edit", "view", "hidden"],
      default: "hidden",
    },
    blueprintAlignment: {
      type: String,
      enum: ["edit", "view", "hidden"],
      default: "hidden",
    },
    businessGoal: {
      type: String,
      enum: ["edit", "view", "hidden"],
      default: "hidden",
    },
    choreographObjectives: {
      type: String,
      enum: ["edit", "view", "hidden"],
      default: "hidden",
    },
    teams: {
      type: String,
      enum: ["edit", "view", "hidden"],
      default: "hidden",
    },
    generateReport: {
      type: String,
      enum: ["edit", "view", "hidden"],
      default: "hidden",
    },
    reportArchives: {
      type: String,
      enum: ["edit", "view", "hidden"],
      default: "hidden",
    },
    agendaBuilder: {
      type: String,
      enum: ["edit", "view", "hidden"],
      default: "hidden",
    },
    archives: {
      type: String,
      enum: ["edit", "view", "hidden"],
      default: "hidden",
    },
  },
  { timestamps: true }
);

export const organizationUserModel = model<IOrganizationUser>(
  "Organization",
  UserSchema
);

const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    companyName: { type: String, required: true },
    companyRole: { type: String, required: true, default: null },
    skills:{type:[String],required:true,default:[]},
    location:{ type: String, required: false ,default:""},
    teamRole:{ type: String, required: false ,default:""},
    type:{ type: String, required: false ,default:""},
    availability:{ type: String, required: false ,default:0},
    role: {
      type: String,
      enum: ["companyEmployee"],
      default: "companyEmployee",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const organizationUserModels = model("Organization-User", userSchema);
