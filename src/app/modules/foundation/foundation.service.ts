import mongoose, { Types } from "mongoose";
import { IFoundation } from "./foundation.interface";
import AppError from "../../errors/AppError";
import status from "http-status";
import { FoundationModel } from "./foundation.model";
import UserModel from "../user/user.model";


const createFoundation = async (data: IFoundation): Promise<IFoundation> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Check if user with this company exists
    const user = await UserModel.findOne({ companyName: data.companyName }).session(session);

    if (!user) {
      throw new Error('Company not found');
    }

    // 2. Create Foundation
    const foundation = await FoundationModel.create([data], { session });

    // 3. Update user with foundationId
    user.foundationId = foundation[0]._id as Types.ObjectId;
    await user.save({ session });

    // 4. Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return foundation[0];
  } catch (error) {
    // Rollback if any error occurs
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getSpecificFoundationByCompanyName = async (companyName: string): Promise<IFoundation | null> => {
  const foundation = await FoundationModel.findOne({ companyName });
  if (!foundation) {
    throw new AppError(status.NOT_FOUND, `Foundation with company name ${companyName} not found`);
  }
  return foundation;
};

const updateFoundation = async (id: string, data: Partial<IFoundation>): Promise<IFoundation | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid foundation ID");
  }
  const foundation = await FoundationModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!foundation) {
    throw new AppError(status.NOT_FOUND, `Foundation with ID ${id} not found`);
  }
  return foundation;
};

const deleteFoundation = async (id: string): Promise<void> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid foundation ID");
  }
  const foundation = await FoundationModel.findByIdAndDelete(id);
  if (!foundation) {
    throw new AppError(status.NOT_FOUND, `Foundation with ID ${id} not found`);
  }
};

export const FoundationService = {
  createFoundation,
  getSpecificFoundationByCompanyName,
  updateFoundation,
  deleteFoundation,
};