import AppError from "../../errors/AppError";

import status from "http-status";
import AssessModel from "./assess.model";
import { TAssess } from "./assess.interface";
const createAssess = async (payload: TAssess) => {
  if(payload){
    throw new AppError(status.BAD_REQUEST,"data is massing !")
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
 
  const result = await AssessModel.find({})
  return result;
};
const getSingleAssess = async (payloadId: string) => {
  if (!payloadId) {
    throw new AppError(status.BAD_REQUEST, "assess id is not found");
  }

  const result = await AssessModel.findOne({ _id: payloadId });
  return result;
};

const updateAssess = async (
  payloadId: string,
  payload: Partial<TAssess>
) => {
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

export const AssessServices = {
  createAssess,
  getAllAssess,
  updateAssess,
  deleteAssess,
  getSingleAssess
};
