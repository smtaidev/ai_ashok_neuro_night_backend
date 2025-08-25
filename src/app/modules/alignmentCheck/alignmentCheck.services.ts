
import AppError from "../../errors/AppError";

import status from "http-status";
import AssessAlignmentCheckModel from "./alignmentCheck.model";
import UserModel from "../user/user.model";
import { AssessAlignmentCheck } from "./alignmentCheck.interface";
import notificationModel from "../notification/notification.model";
const createalignmentCheck = async (companyName:string,userId:string,payload:AssessAlignmentCheck) => {
if (!payload) {
    throw new AppError(status.BAD_REQUEST, "payload  is  required");
  }

  const isEexist=await UserModel.findOne({companyName:payload?.companyName})
  if(!isEexist){
    throw new AppError(status.BAD_REQUEST, "company Name id is not found");
  }


  const notificationData={
  companyName: companyName,
  userId:userId,
  title: payload?.title,
  message:payload.suggestions || "User action in  alignment check",
}

  const result = await AssessAlignmentCheckModel.create({...payload,userId,companyName});
    const createNotification=await notificationModel.create(notificationData)
  
  return result;
}
const getAllalignmentCheck = async (companyName:string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company Name id is not found");
  }

  const result = await AssessAlignmentCheckModel.find({ companyName:companyName});
  return result;
};

const updatealignmentCheck = async (
  payloadId: string,
  payload: Partial<AssessAlignmentCheck>
) => {
  if (!payloadId) {
    throw new AppError(status.BAD_REQUEST, "company Name id is not found");
  }

  const result = await AssessAlignmentCheckModel.findOneAndUpdate(
    { _id: payloadId },
    { $set: payload },
    { new: true }
  );
  return result;
};
const deletealignmentCheck = async (payloadId: string) => {
  if (!payloadId) {
    throw new AppError(status.BAD_REQUEST, "company Name id is not found");
  }

  const result = await AssessAlignmentCheckModel.deleteOne({ _id: payloadId });
  return result;
};

export const alignmentCheckServices = {
  createalignmentCheck,
  getAllalignmentCheck,
  updatealignmentCheck,
  deletealignmentCheck,
};
