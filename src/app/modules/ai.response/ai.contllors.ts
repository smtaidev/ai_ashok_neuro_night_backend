import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { aiRespnonseServices } from "./ai.services";

const getTrendAirecommendations=catchAsync(async(req,res)=>{
    const company=req.user

    const result=await aiRespnonseServices.getAllTrendsAiData(company?.companyName)
   
    sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Clarhet RecommendationAnalysis successfully get!",
    data:result
  });
})
const getSwotirecommendations=catchAsync(async(req,res)=>{
    const company=req.user

    const result=await aiRespnonseServices.getAllSowtAiData(company?.companyName)
   
    sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Swot RecommendationAnalysis successfully get!",
    data:result
  });
})
const challengerecommendations=catchAsync(async(req,res)=>{
    const company=req.user

    const result=await aiRespnonseServices.getChallengetAiData(company?.companyName)
   
    sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "challenge RecommendationAnalysis successfully get!",
    data:result
  });
})



export const aiRespnonseContllors={
    getTrendAirecommendations,
    getSwotirecommendations, 
  challengerecommendations
}