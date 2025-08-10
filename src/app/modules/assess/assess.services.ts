import AppError from "../../errors/AppError";

import status from "http-status";
import AssessModel from "./assess.model";
import { Challenge, ClarhetRecommendation, CompetitorAnalysis, SWOT, TAssess, Trend } from "./assess.interface";
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
const createtrendIntoDb = async (companyName: string, payload: Trend) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const result = await AssessModel.findOneAndUpdate(
    query,
    { $push: { trends: payload } },
    { new: true }
  );

  return result;
};

const updateTrendInDb = async (companyName: string, id: string, payload: Partial<Trend>) => {
  if (!companyName) throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "Trend id is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "trends._id": id
  };

  const setObj: Record<string, any> = {};
  for (const key in payload) {
    const typedKey = key as keyof typeof payload;
    setObj[`trends.$.${typedKey}`] = payload[typedKey];
  }

  const result = await AssessModel.findOneAndUpdate(query, { $set: setObj }, { new: true });
  return result;
};
//----------------swot services section  -----------------------------------------------------------
const createSwotIntoDb = async (companyName: string, payload: SWOT) => {
  console.log(companyName)
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  console.log("check swot data", payload);

  const result = await AssessModel.findOneAndUpdate(
  query,
  { $push: { swot: payload } },
  { new: true }
);


  return result;
};

const updateSwotInDb = async (companyName: string, id: string, payload: Partial<SWOT>) => {
  if (!companyName) throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "SWOT id is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "swot._id": id
  };

  const setObj: Record<string, any> = {};
  for (const key in payload) {
    const typedKey = key as keyof typeof payload;
    setObj[`swot.$.${typedKey}`] = payload[typedKey];
  }

  const result = await AssessModel.findOneAndUpdate(query, { $set: setObj }, { new: true });
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

  console.log("Payload to save:", payload);  // Debug

  const result = await AssessModel.findOneAndUpdate(
    query,
    { $push: { challenges: payload } },
    { new: true, upsert: true }
  );

  console.log("Saved challenge result:", result);  // Debug

  return result;
};



const updateChallengeInDb = async (companyName: string, id: string, payload: Partial<Challenge>) => {
  if (!companyName) throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "Challenge id is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "challenges._id": id
  };

  const setObj: Record<string, any> = {};
  for (const key in payload) {
    const typedKey = key as keyof typeof payload;
    setObj[`challenges.$.${typedKey}`] = payload[typedKey];
  }

  const result = await AssessModel.findOneAndUpdate(query, { $set: setObj }, { new: true });
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

const updateCompetitorAnalysisInDb = async (companyName: string, id: string, payload: Partial<CompetitorAnalysis>) => {
  if (!companyName) throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "CompetitorAnalysis id is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "competitorAnalysis._id": id
  };

  const setObj: Record<string, any> = {};
  for (const key in payload) {
    const typedKey = key as keyof typeof payload;
    setObj[`competitorAnalysis.$.${typedKey}`] = payload[typedKey];
  }

  const result = await AssessModel.findOneAndUpdate(query, { $set: setObj }, { new: true });
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

const updateClarhetRecommendationInDb = async (companyName: string, id: string, payload: Partial<ClarhetRecommendation>) => {
  if (!companyName) throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "ClarhetRecommendation id is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "clarhetRecommendation._id": id
  };

  const setObj: Record<string, any> = {};
  for (const key in payload) {
    const typedKey = key as keyof typeof payload;
    setObj[`clarhetRecommendation.$.${typedKey}`] = payload[typedKey];
  }

  const result = await AssessModel.findOneAndUpdate(query, { $set: setObj }, { new: true });
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
updateClarhetRecommendationInDb
};

