import status from "http-status";
import AppError from "../../errors/AppError";
import { AiRecommendModel, AiTrendModel, AnalysisModel, RiskModel } from "./ai.model"
import { BlueprintModel } from "../blueprint/blueprint.model";
import { FoundationModel } from "../foundation/foundation.model";
import config from "../../../config";
import axios from "axios";

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
  console.log(query)
    const result=await AnalysisModel.findOne(query)
    return result
}
const getChallengeRixScoreData=async(companyName:string)=>{
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
const getChallengetAiData=async(companyName:string)=>{
if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }

    const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };
    const result=await AiRecommendModel.findOne(query)

    console.log(result)
    return result
}
const createThemesAiData=async(companyName:string)=>{
if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }
    const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };
    


  const themesData=await BlueprintModel.findOne(query)
 
  const themes=themesData?.strategicThemes

  const foundation=await FoundationModel.findOne(query)


  


const payload = {
  capabilities: foundation?.differentiatingCapabilities||[]
};
console.log(payload)

const apiUrl = `${config.ai_base_url}/differentiation/analyze`;  

    const response = await axios.post(apiUrl, payload, {
      headers: {
        "Content-Type": "application/json",
      }
    });  

    console.log(response.data)


  const context={
 mission:foundation?.identity?.mission,
    value:foundation?.identity?.value,
    purpose:foundation?.identity?.value,
    customers:foundation?.zeroIn?.targetCustomer,
    value_proposition:foundation?.zeroIn?.valueProposition,
  }
  const allData={
    themes:themes,
   context
  }


// const result=await AiRecommendModel.findOne(query)

    // console.log(result)
    return payload
}

export const aiRespnonseServices={
    getAllTrendsAiData,getAllSowtAiData,getChallengetAiData,
    getChallengeRixScoreData,
    createThemesAiData
}