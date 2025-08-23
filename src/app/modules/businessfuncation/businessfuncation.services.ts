import status from "http-status";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";
import { IBusinessFunction } from "./businessfuncation.interface";
import { BusinessFunction } from "./businessfuncation.model";
// ✅ Create Business Function
const createBusinessFunctionIntoDb = async (companyName: string, payload: IBusinessFunction) => {
      if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  if (!payload.name) {
    throw new AppError(status.BAD_REQUEST, "Business Function name is required!");
  }

  const payloadData = { ...payload, companyName };
  const result = await BusinessFunction.create(payloadData);
  return result;
};

// ✅ Get All Business Functions
const getAllBusinessFunctionsFromDb = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const result = await BusinessFunction.find(query);
  return result;
};

// ✅ Get Single Business Function
const getSingleBusinessFunctionFromDb = async (companyName: string, id: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid ID format!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    _id: new mongoose.Types.ObjectId(id),
  };

  const result = await BusinessFunction.findOne(query);
  if (!result) {
    throw new AppError(status.NOT_FOUND, "Business Function not found!");
  }
  return result;
};

// ✅ Update Business Function
const updateBusinessFunctionIntoDb = async (
  companyName: string,
  id: string,
  payload: Partial<IBusinessFunction>
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid ID format!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    _id: new mongoose.Types.ObjectId(id),
  };

  const result = await BusinessFunction.findOneAndUpdate(query, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Business Function not found!");
  }

  return result;
};

// ✅ Delete Business Function
const deleteBusinessFunctionFromDb = async (companyName: string, id: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid ID format!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    _id: new mongoose.Types.ObjectId(id),
  };

  const result = await BusinessFunction.deleteOne(query);

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Business Function not found!");
  }

  return result;
};

export const businessFunctionServices = {
  createBusinessFunctionIntoDb,
  getAllBusinessFunctionsFromDb,
  getSingleBusinessFunctionFromDb,
  updateBusinessFunctionIntoDb,
  deleteBusinessFunctionFromDb,
};
