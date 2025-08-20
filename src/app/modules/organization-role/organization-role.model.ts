import mongoose, { model } from "mongoose";
import { IOrganizationUser } from "./organization-role.interface";

const UserSchema = new mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId ,required:true,ref:"User"},
  name: {type:String,required:true},
  email:  {type:String,required:true},
  organizationRole:  {type:String,required:true},
  businessFunction:  {type:String,required:true},
  notes:  {type:String,required:true},
  collaboratesWith: {type:[String],required:true},
  permissions: {
    foundations: { type: String, enum: ["edit", "view", "hidden"], default: "hidden" },
    trends: { type: String, enum: ["edit", "view", "hidden"], default: "hidden" },
    swot: { type: String, enum: ["edit", "view", "hidden"], default: "hidden" },
    challenges: { type: String, enum: ["edit", "view", "hidden"], default: "hidden" },
    competitorsAnalysis: { type: String, enum: ["edit", "view", "hidden"], default: "hidden" },
    clarhetAIRec: { type: String, enum: ["edit", "view", "hidden"], default: "hidden" },
    alignment: { type: String, enum: ["edit", "view", "hidden"], default: "hidden" },
    vision: { type: String, enum: ["edit", "view", "hidden"], default: "hidden" },
    themes: { type: String, enum: ["edit", "view", "hidden"], default: "hidden" },
    choreographObjectives: { type: String, enum: ["edit", "view", "hidden"], default: "hidden" },
    teams: { type: String, enum: ["edit", "view", "hidden"], default: "hidden" },
    generateReport: { type: String, enum: ["edit", "view", "hidden"], default: "hidden" },
    reportArchives: { type: String, enum: ["edit", "view", "hidden"], default: "hidden" },
    agendaBuilder: { type: String, enum: ["edit", "view", "hidden"], default: "hidden" },
    archives: { type: String, enum: ["edit", "view", "hidden"], default: "hidden" }
  }})

  export const organizationUserModel =model<IOrganizationUser>("Organization-Users",UserSchema)