import AppError from "../../errors/AppError";

import status from "http-status";
import AssessModel from "./assess.model";
import {
  Challenge,
  ClarhetRecommendation,
  CompetitorAnalysis,
  SWOT,
  TAssess,
  Trend,
} from "./assess.interface";
import axios from "axios";
import config from "../../../config";
import { AiTrendModel } from "../ai.response/ai.model";
const createAssess = async (payload: TAssess) => {
  if (payload) {
    throw new AppError(status.BAD_REQUEST, "data is massing !");
  }
  //   const isEexistAssess = await AssessModel.findOne({
  //     $or: [
  //       { companyName: { $regex: new RegExp(`^${payload.companyName}$`, "i") } },
  //     ],
  //   });

  //   if (isEexistAssess) {
  //     throw new AppError(status.BAD_REQUEST, "finalcial Tracker already exists");
  //   }

  const result = await AssessModel.create(payload);
  return result;
};
const getAllAssess = async () => {
  const result = await AssessModel.find({});
  return result;
};
const getSingleAssess = async (payloadId: string) => {
  if (!payloadId) {
    throw new AppError(status.BAD_REQUEST, "assess id is not found");
  }

  const result = await AssessModel.findOne({ _id: payloadId });
  return result;
};

const updateAssess = async (payloadId: string, payload: Partial<TAssess>) => {
  if (!payloadId) {
    throw new AppError(status.BAD_REQUEST, "assess id is not found");
  }

  const result = await AssessModel.findOneAndUpdate(
    { _id: payloadId },
    { $set: payload },
    { new: true }
  );
  return result;
};
const deleteAssess = async (payloadId: string) => {
  if (!payloadId) {
    throw new AppError(status.BAD_REQUEST, "assess id is not found");
  }

  const result = await AssessModel.deleteOne({ _id: payloadId });
  return result;
};

//----------------trends services section  -----------------------------------------------------------
const createtrendIntoDb = async (companyName: string, payload: Trend[]) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const schema2: any = {
    customer_insights: [],
    competitor_landscape: [],
    EconomicConsiderations: [],
    technological_advances: [],
    regulatory_and_legal: [],
    supply_chain_logistics: [],
    global_market_trends: [],
    environmental_social_impact: [],
    collaboration_partnerships: [],
    scenarios_risk_assessment: [],
    emerging_markets_opportunities: [],
    on_the_radar: [],
  };

  // Basic mapping logic
  for (let i = 0; i < payload.length; i++) {
    const trend = payload[i];

    for (let j = 0; j < trend.trendDetails.length; j++) {
      const detail = trend.trendDetails[j];

      if (trend.trendName === "Customer Insights") {
        schema2.customer_insights.push({
          question: detail.question,
          answer: detail.answer,
          impact: detail.impactLevel,
        });
      } else if (trend.trendName === "Competitor Landscape") {
        schema2.competitor_landscape.push({
          question: detail.question,
          answer: detail.answer,
          impact: detail.impactLevel,
        });
      } 

    else if (trend.trendName === "Economic Considerations") {
      schema2. EconomicConsiderations.push({
        question: detail.question,
        answer: detail.answer,
        impact: detail.impactLevel
      });
    } 
    
 else if (trend.trendName === "Technological Advances") {
      schema2. technological_advances.push({
        question: detail.question,
        answer: detail.answer,
        impact: detail.impactLevel
      });
    } 
    
   else if (trend.trendName === "Regulatory and Legal Factors") {
      schema2. regulatory_and_legal.push({
        question: detail.question,
        answer: detail.answer,
        impact: detail.impactLevel
      });
    } 
    
 else if (trend.trendName === "Supply Chain and Logistics") {
      schema2.supply_chain_logistics.push({
        question: detail.question,
        answer: detail.answer,
        impact: detail.impactLevel
      });
    } 
    
 else if (trend.trendName === "Global Market Trends") {
      schema2. global_market_trends.push({
        question: detail.question,
        answer: detail.answer,
        impact: detail.impactLevel
      });
    } 
    
 else if (trend.trendName === "Environmental and Social Impact") {
      schema2. environmental_social_impact.push({
        question: detail.question,
        answer: detail.answer,
        impact: detail.impactLevel
      });
    } 
    
  else if (trend.trendName === "Collaboration and Partnerships") {
      schema2.collaboration_partnerships.push({
        question: detail.question,
        answer: detail.answer,
        impact: detail.impactLevel
      });
    } 
    
 else if (trend.trendName === "Scenarios and Risk Assessment") {
      schema2.scenarios_risk_assessment.push({
        question: detail.question,
        answer: detail.answer,
        impact: detail.impactLevel
      });
    } 
    
 else if (trend.trendName === "Emerging Markets and Opportunities") {
      schema2. emerging_markets_opportunities.push({
        question: detail.question,
        answer: detail.answer,
        impact: detail.impactLevel
      });
    } 
    
   else if (trend.trendName === "On The Radar") {
      schema2. on_the_radar.push({
        question: detail.question,
        answer: detail.answer,
        impact: detail.impactLevel
      });
    } 
    
  
    }
  }



  const apiUrl = `${config.ai_base_url}/trends/analyze`;  

    const response = await axios.post(apiUrl, schema2, {
      headers: {
        'Content-Type': 'application/json',
      }
    });


   const aiData=response.data
   const aiSubmitData={
    companyName:companyName,
   ...aiData
   }

   const AiTrends=await AiTrendModel.create(aiSubmitData)
   console.log(AiTrends)
  const result = await AssessModel.findOneAndUpdate(
    query,
    { $set: { trends: payload } },
    { new: true }
  );

  return result;
};

const updateTrendInDb = async (
  companyName: string,
  id: string,
  payload: Partial<Trend>
) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "Trend id is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "trends._id": id,
  };

  const setObj: Record<string, any> = {};
  for (const key in payload) {
    const typedKey = key as keyof typeof payload;
    setObj[`trends.$.${typedKey}`] = payload[typedKey];
  }

  const result = await AssessModel.findOneAndUpdate(
    query,
    { $set: setObj },
    { new: true }
  );
  return result;
};

const getAllTrendsFromDb = async (companyName: string) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");

  const result = await AssessModel.findOne(
    { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } },
    { trends: 1, _id: 0 }
  );

  if (!result)
    throw new AppError(status.NOT_FOUND, "No trends found for this company");

  return result.trends;
};

const getSingleTrendFromDb = async (companyName: string, id: string) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "Trend id is required!");

  const result = await AssessModel.findOne(
    {
      companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
      "trends._id": id,
    },
    { "trends.$": 1 }
  );

  if (!result || !result.trends?.length) {
    throw new AppError(status.NOT_FOUND, "Trend not found");
  }

  return result.trends[0];
};

const deleteTrendFromDb = async (companyName: string, id: string) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "Trend id is required!");

  const result = await AssessModel.findOneAndUpdate(
    { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } },
    { $pull: { trends: { _id: id } } },
    { new: true }
  );

  if (!result)
    throw new AppError(status.NOT_FOUND, "Trend not found or already deleted");

  return result;
};

//----------------swot services section  -----------------------------------------------------------
const createSwotIntoDb = async (companyName: string, payload: SWOT) => {
  console.log(companyName);
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  console.log("check swot data", payload);

  console.log(payload)
  const result = await AssessModel.findOneAndUpdate(
    query,
    { $push: { swot: payload } },
    { new: true }
  );

  return result;
};

const createSwotSingleIntoDb = async (companyName: string, payload: any) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const { categoryName, details } = payload;

  const allowedCategories = [
    "strengths",
    "weaknesses",
    "opportunities",
    "threats",
  ];
  if (!allowedCategories.includes(categoryName)) {
    throw new AppError(status.BAD_REQUEST, "Invalid category name!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const detailToPush =
    typeof details === "string" ? { details: details } : details;

  const result = await AssessModel.findOneAndUpdate(
    query,
    { $push: { [`swot.0.${categoryName}`]: detailToPush } },
    { new: true }
  );

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Company not found");
  }

  return result;
};

const getAllSwotByCompany = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  // swot ফিল্ড নিয়ে আসছি
  const result = await AssessModel.findOne(query, { _id: 0, swot: 1 });

  console.log("check the swor result ", result);
  if (!result) {
    throw new AppError(status.NOT_FOUND, "Company not found");
  }

  return result.swot;
};

const updateSwotInDb = async (
  companyName: string,
  id: string,
  payload: Partial<SWOT>
) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "SWOT id is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "swot._id": id,
  };

  const setObj: Record<string, any> = {};
  for (const key in payload) {
    const typedKey = key as keyof typeof payload;
    setObj[`swot.$.${typedKey}`] = payload[typedKey];
  }

  const result = await AssessModel.findOneAndUpdate(
    query,
    { $set: setObj },
    { new: true }
  );
  return result;
};

//----------------Challenge services section  -----------------------------------------------------------
const createChallengeIntoDb = async (companyName: string, payload: any) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  console.log("Payload to save:", payload); // Debug

  const result = await AssessModel.findOneAndUpdate(
    query,
    { $push: { challenges: payload } },
    { new: true, upsert: true }
  );

  console.log("Saved challenge result:", result); // Debug

  return result;
};

const updateChallengeInDb = async (
  companyName: string,
  id: string,
  payload: Partial<Challenge>
) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "Challenge id is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "challenges._id": id,
  };

  const setObj: Record<string, any> = {};
  for (const key in payload) {
    const typedKey = key as keyof typeof payload;
    setObj[`challenges.$.${typedKey}`] = payload[typedKey];
  }

  const result = await AssessModel.findOneAndUpdate(
    query,
    { $set: setObj },
    { new: true }
  );
  return result;
};
//----------------CompetitorAnalysis services section  -------------------------------------------
const createCompetitorAnalysisIntoDb = async (
  companyName: string,
  payload: CompetitorAnalysis
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const result = await AssessModel.findOneAndUpdate(
    query,
    { $push: { competitorAnalysis: payload } },
    { new: true }
  );

  return result;
};

const updateCompetitorAnalysisInDb = async (
  companyName: string,
  id: string,
  payload: Partial<CompetitorAnalysis>
) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id)
    throw new AppError(
      status.BAD_REQUEST,
      "CompetitorAnalysis id is required!"
    );

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "competitorAnalysis._id": id,
  };

  const setObj: Record<string, any> = {};
  for (const key in payload) {
    const typedKey = key as keyof typeof payload;
    setObj[`competitorAnalysis.$.${typedKey}`] = payload[typedKey];
  }

  const result = await AssessModel.findOneAndUpdate(
    query,
    { $set: setObj },
    { new: true }
  );
  return result;
};
//----------------ClarhetRecommendation services section  -------------------------------------------
const createClarhetRecommendationIntoDb = async (
  companyName: string,
  payload: ClarhetRecommendation
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const result = await AssessModel.findOneAndUpdate(
    query,
    { $push: { clarhetRecommendation: payload } },
    { new: true }
  );

  return result;
};

const updateClarhetRecommendationInDb = async (
  companyName: string,
  id: string,
  payload: Partial<ClarhetRecommendation>
) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id)
    throw new AppError(
      status.BAD_REQUEST,
      "ClarhetRecommendation id is required!"
    );

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "clarhetRecommendation._id": id,
  };

  const setObj: Record<string, any> = {};
  for (const key in payload) {
    const typedKey = key as keyof typeof payload;
    setObj[`clarhetRecommendation.$.${typedKey}`] = payload[typedKey];
  }

  const result = await AssessModel.findOneAndUpdate(
    query,
    { $set: setObj },
    { new: true }
  );
  return result;
};
export const AssessServices = {
  createAssess,
  getAllAssess,
  updateAssess,
  deleteAssess,
  getSingleAssess,
  createtrendIntoDb,
  createSwotIntoDb,
  createChallengeIntoDb,
  createCompetitorAnalysisIntoDb,
  createClarhetRecommendationIntoDb,
  updateTrendInDb,
  updateChallengeInDb,
  updateSwotInDb,
  updateCompetitorAnalysisInDb,
  updateClarhetRecommendationInDb,
  getAllTrendsFromDb,
  getSingleTrendFromDb,
  deleteTrendFromDb,
  createSwotSingleIntoDb,
  getAllSwotByCompany,
};
