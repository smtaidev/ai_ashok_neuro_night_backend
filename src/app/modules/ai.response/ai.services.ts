import status from "http-status";
import AppError from "../../errors/AppError";
import {
  AiRecommendModel,
  AiTrendModel,
  AnalysisModel,
  DifferentiatingModel,
  RiskModel,
  VisionAssessmentModel,
} from "./ai.model";
import { BlueprintModel } from "../blueprint/blueprint.model";
import { FoundationModel } from "../foundation/foundation.model";
import config from "../../../config";
import axios from "axios";
import AssessModel from "../assess/assess.model";

const getAllTrendsAiData = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };
  const result = await AiTrendModel.findOne(query);
  return result;
};
const getAllSowtAiData = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };
  console.log(query);
  const result = await AnalysisModel.findOne(query);
  return result;
};
const getChallengeRixScoreData = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };
  const result = await RiskModel.findOne(query);

  console.log(result);
  return result;
};
const getChallengetAiData = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };
  const result = await AiRecommendModel.findOne(query);

  console.log(result);
  return result;
};
const createThemesAiData = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };
  const themesData = await BlueprintModel.findOne(query);
 const themes = themesData?.strategicThemes?.map(({ name, description }) => ({
  name,
  description
}));

  const foundation = await FoundationModel.findOne(query).lean();

  const assessData = await AssessModel.findOne(query).lean();
  const competitors = assessData?.competitorAnalysis
    .map(({ name, description }) => ({ name, description })) // শুধু প্রয়োজনীয় fields
    .filter((item) => item.name && item.description) // null filter
    .filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) => t.name === item.name && t.description === item.description
        ) // duplicate remove
    );
  const capabilities = foundation?.capabilitys
    .map(({ capability, type }) => ({ capability, type })) // শুধু প্রয়োজনীয় fields
    .filter((item) => item.capability && item.type) // null filter
    .filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) => t.capability === item.capability && t.type === item.type
        ) // duplicate remove
    );


    const challengeData=await RiskModel.find(query) as any
 const formattedChallenges = challengeData?.[0]?.challenge?.map((item:any) => ({
  title: item.title,
  category: item.category,
  impact_on_business: item.impact_on_business
    ? item.impact_on_business.charAt(0).toUpperCase() + item.impact_on_business.slice(1).toLowerCase()
    : "",
  ability_to_address: item.ability_to_address
    ? item.ability_to_address.charAt(0).toUpperCase() + item.ability_to_address.slice(1).toLowerCase()
    : "",
  description: item.description,
  risk_score: item.risk_score
})) || [];


  const context = {
    mission: foundation?.identity?.mission,
    value: foundation?.identity?.value,
    purpose: foundation?.identity?.value,
    customers: foundation?.zeroIn?.targetCustomer,
    value_proposition: foundation?.zeroIn?.valueProposition,
    capabilities,
    competitors,
    challenges: formattedChallenges
  };
  const allData = {
    themes: themes,
    context,
  };

  console.log(JSON.stringify(allData,null,2))




  try {
    
    
  const apiUrls = `${config.ai_base_url}/strategic-theme2/combined-analysis`;

  const responses = await axios.post(apiUrls, allData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const themesAiData = responses.data;
    console.log(themesAiData);
      return themesAiData
  } catch (error:any) {
    throw new AppError(status.BAD_REQUEST,error?.message)
  }
  // --------------------- this si differentiation analyze services -----------------------------------------------

  // const payload = {
  //   capabilities: foundation?.differentiatingCapabilities || [],
  // };

  // const apiUrl = `${config.ai_base_url}/differentiation/analyze`;

  // const response = await axios.post(apiUrl, payload, {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });

  // console.log(response.data);

  // const difrentcapabilites = response.data;

  // const result=await AiRecommendModel.findOne(query)

  // console.log(result)

};


const createBusinessGoalAi = async (companyName: string) => {
  if (!companyName) throw new AppError(status.BAD_REQUEST, "company name is not found !");

  const query = { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } };

  const business = await BlueprintModel.findOne(query).lean();
  const themesData = await BlueprintModel.findOne(query);
  const aichallengeDataFind = await RiskModel.findOne(
    { companyName },
    { companyName: 0, _id: 0, __v: 0 }
  ).lean();
  const visionData = await BlueprintModel.findOne(query).lean();

  // Clean strategic_themes
  const strategic_themes = themesData?.strategicThemes.map(theme => {
    const obj = (theme as any).toObject ? (theme as any).toObject() : theme;
    const { _id, createdAt, updatedAt, ...rest } = obj;
    return rest;
  });

  // Clean goals and nested impact_ratings
  // const goals = business?.businessGoals.map(goal => {
  //   const g = goal as any;
  //   const { _id, createdAt, updatedAt, impact_ratings, ...rest } = g;

  //   let cleanImpactRatings = undefined;
  //   if (impact_ratings) {
  //     const ir = impact_ratings as any;
  //     const { _id: irId, createdAt: irCreatedAt, updatedAt: irUpdatedAt, ...otherRatings } = ir;
  //     cleanImpactRatings = otherRatings;
  //   }

  //   return { ...rest, impact_ratings: cleanImpactRatings };
  // });


  const goals = business?.businessGoals.map(goal => {
  const g = goal as any;
  const { impact_ratings } = g;

  let cleanImpactRatings = undefined;
  if (impact_ratings) {
    const ir = impact_ratings as any;
    const { _id: irId, createdAt: irCreatedAt, updatedAt: irUpdatedAt, ...otherRatings } = ir;
    cleanImpactRatings = otherRatings;
  }
 
  const businessGoalForAi = {
    title: g.title,
    description: g.description,
    related_strategic_theme: g.related_strategic_theme,
    priority: g.priority,
    resource_readiness: g.resource_readiness,
    assigned_functions: g.assigned_functions,
    duration: g.duration,
    esg_issues: g.esg_issues,
    new_capabilities_needed: g.new_capabilities_needed,
    existing_capabilities_to_enhance: g.existing_capabilities_to_enhance,
    impact_ratings: cleanImpactRatings
  };

  return { ...businessGoalForAi };
});


  // Clean challenges
  const challenges = aichallengeDataFind?.challenge.map(ch => {
    const c = ch as any;
    const { _id, createdAt, updatedAt, ...rest } = c;
    return rest;
  });


  const allData = {
    strategic_themes,
    goals,
    challenges,
    vision: visionData?.vision,
  };



  console.log(JSON.stringify(allData,null,2))
  const apiUrls = `${config.ai_base_url}/business-goal/analyze2`;
  const responses = await axios.post(apiUrls, allData, {
    headers: { "Content-Type": "application/json" },
  });

  return responses.data;
};




const createVisionAI=async(companyName:string)=>{
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  
    // const visionData=await BlueprintModel.findOne(query)
  
    // const vision_statement=visionData?.vision
    // console.log(vision_statement)
    //  const apiUrls = `${config.ai_base_url}/blueprint/vision`;
  
    // const responses = await axios.post(apiUrls, {vision_statement}, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });


    // return responses.data
    const result=await VisionAssessmentModel.find(query)
    return result

}

const createSwotAiData=async(companyName:string)=>{
  const query = { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } };

  const rawData = await AssessModel.findOne(query, { swot: 1, _id: 0 });
  const cleanResponse = {
      strengths:
        rawData?.swot?.[0]?.strengths?.map((s: any) => s.details) || [],
      weaknesses:
        rawData?.swot?.[0]?.weaknesses?.map((w: any) => w.details) || [],
      opportunities:
        rawData?.swot?.[0]?.opportunities?.map((o: any) => o.details) || [],
      threats: rawData?.swot?.[0]?.threats?.map((t: any) => t.details) || [],
  }

  const apiUrl = `${config.ai_base_url}/swot/analysis`;

  const response = await axios.post(apiUrl, cleanResponse, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data)

return response.data
}

const getDifferentCapability=async(companyName:string
)=>{

    if (!companyName) {
      throw new AppError(status.BAD_REQUEST, "Company name is not found!");
    }
  
  const query = { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } };


const getCapability=await DifferentiatingModel.findOne(query)

return getCapability
}

export const aiRespnonseServices = {
  getAllTrendsAiData,
  getAllSowtAiData,
  getChallengetAiData,
  getChallengeRixScoreData,
  createThemesAiData,
  createBusinessGoalAi,
  createVisionAI,
  createSwotAiData,
  getDifferentCapability
};
