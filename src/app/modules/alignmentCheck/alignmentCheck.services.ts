
import AppError from "../../errors/AppError";

import status from "http-status";
import AssessAlignmentCheckModel from "./alignmentCheck.model";
const createalignmentCheck = async (payload:AssessAlignmentCheck) => {
  const result = await AssessAlignmentCheckModel.create(payload);
  return result;
};
const getAllalignmentCheck = async (payloadId: string) => {
  if (!payloadId) {
    throw new AppError(status.BAD_REQUEST, "finalcial Tracke id is not found");
  }

  const result = await AssessAlignmentCheckModel.findOne({ _id: payloadId });
  return result;
};

const updatealignmentCheck = async (
  payloadId: string,
  payload: Partial<AssessAlignmentCheck>
) => {
  if (!payloadId) {
    throw new AppError(status.BAD_REQUEST, "finalcial Tracke id is not found");
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
    throw new AppError(status.BAD_REQUEST, "finalcial Tracke id is not found");
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
