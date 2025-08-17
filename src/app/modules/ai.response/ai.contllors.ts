import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { aiRespnonseServices } from "./ai.services";

const getTrendAirecommendations=catchAsync(async(req,res)=>{
    const company=req.user

    const result=await aiRespnonseServices.getAllTrendsAiData(company?.companyName)
   
    sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Trend RecommendationAnalysis successfully get!",
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
const challengeRixScore=catchAsync(async(req,res)=>{
    const company=req.user

    const result=await aiRespnonseServices.getChallengeRixScoreData(company?.companyName)
   
    sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "challenge RecommendationAnalysis successfully get!",
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
const createThemesAi=catchAsync(async(req,res)=>{
    const company=req.user

    const result=await aiRespnonseServices.createThemesAiData(company?.companyName)
   
    sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "thems ai data  successfully created",
    data:result
  });
})
const createBusinessGoalAi=catchAsync(async(req,res)=>{
    const company=req.user

    const result=await aiRespnonseServices.createBusinessGoalAi(company?.companyName)
   
    sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "business Goal ai data  successfully created",
    data:result
  });

})
const createVision=catchAsync(async(req,res)=>{
    const company=req.user

    const result=await aiRespnonseServices.createVisionAI(company?.companyName)
   
    sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "vision ai data  successfully created",
    data:result
  });

})



export const aiRespnonseContllors={
    getTrendAirecommendations,
    getSwotirecommendations, 
  challengerecommendations,
  challengeRixScore,
  createThemesAi,
  createBusinessGoalAi,
  createVision

}