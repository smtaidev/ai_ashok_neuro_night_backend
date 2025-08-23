import status from "http-status";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";
import { TalentOverview } from "./Talent.model";
import { ITalentOverview } from "./Talent.interface";

// ✅ Create Talent Overview
const createTalentOverviewIntoDb = async (
  companyName: string,
  payload: ITalentOverview
) => {
  if (!payload.talent) {
    throw new AppError(status.BAD_REQUEST, "Talent field is required!");
  }

  const payloadData = { ...payload, companyName };
  const result = await TalentOverview.create(payloadData);
  return result;
};

// ✅ Get All Talent Overviews for a Company
const getAllTalentOverviewsFromDb = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const result = await TalentOverview.find(query);
  return result;
};

// ✅ Get Single Talent Overview by ID
const getSingleTalentOverviewFromDb = async (
  companyName: string,
  id: string
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    _id: new mongoose.Types.ObjectId(id),
  };

  const result = await TalentOverview.findOne(query);
  if (!result) {
    throw new AppError(status.NOT_FOUND, "Talent Overview not found!");
  }
  return result;
};

// ✅ Update Talent Overview
const updateTalentOverviewIntoDb = async (
  companyName: string,
  id: string,
  payload: Partial<ITalentOverview>
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    _id: new mongoose.Types.ObjectId(id),
  };

  const result = await TalentOverview.findOneAndUpdate(query, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Talent Overview not found!");
  }

  return result;
};

// ✅ Delete Talent Overview
const deleteTalentOverviewFromDb = async (
  companyName: string,
  id: string
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    _id: new mongoose.Types.ObjectId(id),
  };

  const result = await TalentOverview.deleteOne(query);
  if (!result.deletedCount) {
    throw new AppError(status.NOT_FOUND, "Talent Overview not found!");
  }

  return result;
};

export const talentOverviewServices = {
  createTalentOverviewIntoDb,
  getAllTalentOverviewsFromDb,
  getSingleTalentOverviewFromDb,
  updateTalentOverviewIntoDb,
  deleteTalentOverviewFromDb,
};
