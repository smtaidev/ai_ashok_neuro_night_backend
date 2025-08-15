import status from "http-status";
import AppError from "../../errors/AppError";
import {
  AiRecommendModel,
  AiTrendModel,
  AnalysisModel,
  RiskModel,
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
  const themes = themesData?.strategicThemes;

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
  const context = {
    mission: foundation?.identity?.mission,
    value: foundation?.identity?.value,
    purpose: foundation?.identity?.value,
    customers: foundation?.zeroIn?.targetCustomer,
    value_proposition: foundation?.zeroIn?.valueProposition,
    capabilities,
    competitors,
  };
  const allData = {
    themes: themes,
    context,
  };

 console.log(JSON.stringify(allData, null, 2));

  const apiUrls = `${config.ai_base_url}/strategic-theme2/combined-analysis`;

  const responses = await axios.post(apiUrls, allData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const themesAiData = responses.data;
  console.log(themesAiData);
  // --------------------- this si differentiation analyze services -----------------------------------------------

  const payload = {
    capabilities: foundation?.differentiatingCapabilities || [],
  };

  const apiUrl = `${config.ai_base_url}/differentiation/analyze`;

  const response = await axios.post(apiUrl, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(response.data);

  const difrentcapabilites = response.data;

  // const result=await AiRecommendModel.findOne(query)

  // console.log(result)
  return {themesAiData,difrentcapabilites,}
};

export const aiRespnonseServices = {
  getAllTrendsAiData,
  getAllSowtAiData,
  getChallengetAiData,
  getChallengeRixScoreData,
  createThemesAiData,
};
