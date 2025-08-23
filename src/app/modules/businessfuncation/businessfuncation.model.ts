import mongoose from "mongoose";
import { IBusinessFunction } from "./businessfuncation.interface";

const businessFunctionSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  }
,},{timestamps:true});

export const BusinessFunction= mongoose.model<IBusinessFunction>("business-function", businessFunctionSchema);
