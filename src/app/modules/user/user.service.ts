import { fi } from "zod/v4/locales/index.cjs";
import { IUser } from "./user.interface";
import UserModel from "./user.model";
import bcrypt from "bcrypt";
import mongoose, { Types } from "mongoose";
import AppError from "../../errors/AppError";
import status from "http-status";
import AssessModel from "../assess/assess.model";
import { BlueprintModel } from "../blueprint/blueprint.model";
import choreographModel from "../choreograph/choreograph.model";
import { FoundationModel } from "../foundation/foundation.model";
const createUser = async (userData: IUser): Promise<IUser> => {
  const companyRole = (userData.role == 'companyAdmin') ? "admin" : null;

  const isEexistUser = await UserModel.findOne({
    $or: [
      { email: userData.email },
      { companyName: { $regex: new RegExp(`^${userData.companyName}$`, 'i') } }
    ]
  });

  if (isEexistUser) {
    throw new AppError(status.BAD_REQUEST, "User already exists");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = (await UserModel.create(
      [{ ...userData, companyRole }],
      { session }
    ))[0];

    await AssessModel.create(
      [{ companyName: user?.companyName }],
      { session }
    );

    await BlueprintModel.create(
      [{ companyName: user?.companyName }],
      { session }
    );
    await choreographModel.create(
      [{ companyName: user?.companyName }],
      { session }
    );
    await FoundationModel.create(
      [{ companyName: user?.companyName }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return user;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error);
  }
};


const getAllUsers = async (): Promise<IUser[]> => {
  const users = await UserModel.find({ isDeleted: false });
  return users;
};

const getUserById = async (id: string): Promise<IUser | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid user ID");
  }
  const user = await UserModel.findOne({ _id: id, isDeleted: false });
  return user;
};

const updateUser = async (
  id: string,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid user ID");
  }
  const user = await UserModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: updateData },
    { new: true, runValidators: true }
  );
  return user;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid user ID");
  }
  const user = await UserModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  );
  return user;
};

const changePasswordIntoDB = async (
  id: string,
  oldPassword: string,
  newPassword: string
): Promise<IUser | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid user ID");
  }
  const user = await UserModel.findOne({ _id: id, isDeleted: false });
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid current password");
  }

  user.password = newPassword;
  await user.save();
  return user;
};

export const UserServices = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePasswordIntoDB,
};
