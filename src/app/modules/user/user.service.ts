import { fi, is } from "zod/v4/locales/index.cjs";
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
import { organizationUserModels } from "../organization-role/organization-role.model";
import { sendEmail } from "../../utils/sendMail";
import { createPasswordSetupToken } from "../../utils/password.create";
import config from "../../../config";
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

    const token = createPasswordSetupToken({
      userId: String(user._id),
      email: user.email,
    });

    const setupLink = `${config.frontend_url}/setup-password?token=${token}`;

    // HTML version
    const htmlContent = `
  <h2>Hello ${user.userName},</h2>
  <p>Your account has been created for <b>Clarhet Admin</b>.</p>
  <p>Please set your password by clicking the secure link below:</p>
  <p><a href="${setupLink}" target="_blank">Set Your Password</a></p>
  <p><small>This link is valid for 12 hours. If you did not expect this email, please ignore it.</small></p>
`;

    // Plain text version
    const textContent = `
Hello ${user.userName},

Your account has been created for Clarhet Admin.

Please set your password by visiting the link below:
${setupLink}

This link is valid for 12 hours. If you did not expect this email, please ignore it.
`;

    // Send the email
    await sendEmail(user.email, "Set Your Password", htmlContent, textContent);
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

const getMe = async (companyName:string, userId:string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

   if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");

   
     const query = {
       companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
       _id: new mongoose.Types.ObjectId(userId),
       isDeleted:false
     };

  const user = await UserModel.findOne(query)|| await organizationUserModels.findOne(query)
  console.log(user)
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
  getMe
};
