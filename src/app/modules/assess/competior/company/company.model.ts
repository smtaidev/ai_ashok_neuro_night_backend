import mongoose, { model } from "mongoose";
const CompanySchema = new mongoose.Schema({
 name: { type: String, required: true },
 domain: String,
 ticker: String,
 createdAt: { type: Date, default: Date.now }
});
 export const companyModels=model("competitor-stores",CompanySchema)