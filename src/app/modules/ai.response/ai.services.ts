import status from "http-status";
import AppError from "../../errors/AppError";
import { AiTrendModel, AnalysisModel, RiskModel } from "./ai.model"
import AssessModel from "../assess/assess.model";

const getAllTrendsAiData=async(companyName:string)=>{
if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }

    const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };
    const result=await AiTrendModel.findOne(query)
    return result
}
const getAllSowtAiData=async(companyName:string)=>{
if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }

    const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };
    const result=await AnalysisModel.findOne(query)
    return result
}
const getChallengetAiData=async(companyName:string)=>{
if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }

    const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };
    const result=await RiskModel.findOne(query)

    console.log(result)
    return result
}

export const aiRespnonseServices={
    getAllTrendsAiData,getAllSowtAiData,getChallengetAiData
}