import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  founded: { type: String, trim: true }, // Could be year or custom text
  year: { type: String },
  businessType: { type: String, trim: true },
  companyDescriptions: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
,},{timestamps:true});

export const companyInfoModel= mongoose.model("Company-Info", CompanySchema);