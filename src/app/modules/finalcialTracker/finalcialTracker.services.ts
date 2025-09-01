import AppError from "../../errors/AppError";
import { IFinancialTracker } from "./finalcialTracker.interface";
import { FinancialTracker } from "./finalcialTracker.model";
import status from "http-status";
const createfinalcialTracker = async (companyName:string,payload: IFinancialTracker) => {
  const isEexistfinalcialTracker = await FinancialTracker.findOne({
    $or: [
      { companyName: { $regex: new RegExp(`^${payload.companyName}$`, "i") } },
    ],
  });

  if (isEexistfinalcialTracker) {
    throw new AppError(status.BAD_REQUEST, "finalcial Tracker already exists");
  }
    if (!companyName)
      throw new AppError(status.BAD_REQUEST, "Company name is required");

  const result = await FinancialTracker.create({...payload,companyName});
  return result;
};
const getAllfinalcialTracker = async (companyName: string) => {
 if (!companyName)
      throw new AppError(status.BAD_REQUEST, "Company name is required");

  const result = await FinancialTracker.findOne({ companyName: companyName });
  return result;
};

const updatefinalcialTracker = async (
  payloadId: string,
  payload: Partial<IFinancialTracker>
) => {
  if (!payloadId) {
    throw new AppError(status.BAD_REQUEST, "finalcial Tracke id is not found");
  }

  const result = await FinancialTracker.findOneAndUpdate(
    { _id: payloadId },
    { $set: payload },
    { new: true }
  );
  return result;
};
const deletefinalcialTracker = async (payloadId: string) => {
  if (!payloadId) {
    throw new AppError(status.BAD_REQUEST, "finalcial Tracke id is not found");
  }

  const result = await FinancialTracker.deleteOne({ _id: payloadId });
  return result;
};

export const finalcialTrackerServices = {
  createfinalcialTracker,
  getAllfinalcialTracker,
  updatefinalcialTracker,
  deletefinalcialTracker,
};
