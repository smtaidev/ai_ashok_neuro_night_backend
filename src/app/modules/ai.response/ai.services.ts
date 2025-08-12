import status from "http-status";
import AppError from "../../errors/AppError";
import { AiTrendModel } from "./ai.model"

const getAllTrendsAiData=async(companyName:string)=>{
if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }

    const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };
    const result=await AiTrendModel.find(query)
    return result
}

export const aiRespnonseServices={
    getAllTrendsAiData
}