import status from "http-status";
import AppError from "../../errors/AppError";
import { IOrganizationUser } from "./organization-role.interface";
import { organizationUserModel, organizationUserModels } from "./organization-role.model";
import UserModel from "../user/user.model";
import mongoose from "mongoose";
import { createPasswordSetupToken } from "../../utils/password.create";
import { sendEmail } from "../../utils/sendMail";
import config from "../../../config";
import jwt from'jsonwebtoken'
import  bcrypt from 'bcrypt'
const createOrganizationUser = async (
  companyName: string,
  payload: IOrganizationUser
) => {
  if (!payload.name || !payload.email) {
    throw new AppError(status.BAD_REQUEST, "Name and Email are required!");
  }
  const userData = {
    userName: payload.name,
    email: payload.email,
    password: "vtemporary-initial",
    companyName: companyName,
    companyRole: payload.companyRole ,
    role:"companyEmployee",
    isDeleted: true,
  };

  const isEexistUser = await organizationUserModels.findOne({
       email: userData.email 
  });

  if (isEexistUser) {
    throw new AppError(status.BAD_REQUEST, "User already exists");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

   const [user] = await organizationUserModels.create([userData], { session });
   console.log(payload)
    const result = await organizationUserModel.create([
      { ...payload, userId: user._id,companyName }],
      { session },
    );

    const token = createPasswordSetupToken({ userId: String(user._id), email: user.email });

const setupLink = `${config.frontend_url}/setup-password?token=${token}`;

// HTML version
const htmlContent = `
  <h2>Hello ${user.userName},</h2>
  <p>Your account has been created for <b>${companyName}</b>.</p>
  <p>Please set your password by clicking the secure link below:</p>
  <p><a href="${setupLink}" target="_blank">Set Your Password</a></p>
  <p><small>This link is valid for 12 hours. If you did not expect this email, please ignore it.</small></p>
`;

// Plain text version
const textContent = `
Hello ${user.userName},

Your account has been created for ${companyName}.

Please set your password by visiting the link below:
${setupLink}

This link is valid for 12 hours. If you did not expect this email, please ignore it.
`;

// Send the email
await sendEmail(user.email, "Set Your Password", htmlContent, textContent);
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error);
  }
};

const getAllOrganizationUsers = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };
  const result = await organizationUserModel
    .find(query)
    .populate("userId")
    .select("-password");
  return result;
};

const getSingleOrganizationUser = async (companyName: string, id: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }
  const query = {
    companyName: {
      $regex: new RegExp(`^${companyName}$`, "i"),
      _id: new mongoose.Types.ObjectId(id),
    },
  };
  const result = await organizationUserModels.findOne(query)
    .select("-password")
    .populate("userId");
  if (!result) {
    throw new AppError(status.NOT_FOUND, "User not found!");
  }
  return result;
};

const updateOrganizationUser = async (
  companyName: string,
  userId: string,
  payload: Partial<IOrganizationUser>
) => {
  if (!userId) {
    throw new AppError(status.BAD_REQUEST, "user id is not found !");
  }

  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    userId: new mongoose.Types.ObjectId(userId),
  };

  const isEexist = await organizationUserModels.findOne({ _id: userId });
  if (!isEexist) {
    throw new AppError(status.BAD_REQUEST, "user is not found for db !");
  }

  const result = await organizationUserModel.updateOne(query, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new AppError(status.NOT_FOUND, "User not found!");
  }
  return result;
};

const deleteOrganizationUser = async (companyName: string, id: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    _id: new mongoose.Types.ObjectId(id),
  };

  const quers = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    userId: new mongoose.Types.ObjectId(id),
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const DeleteUser = await organizationUserModels.deleteOne(query);
    await organizationUserModel.deleteOne(quers);
    await session.commitTransaction();
    session.endSession();

    return DeleteUser;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error);
  }


};

 const setupPassword = async (token: string, newPassword: string) => {
  if (!token) throw new AppError(status.BAD_REQUEST, "Token is required");
  if (!newPassword) throw new AppError(status.BAD_REQUEST, "New password is required");
console.log(token)
  let payload: any;
  try {
    payload = jwt.verify(token, config.jwt_password_setup_secret as string);
  } catch (err) {
    throw new AppError(status.UNAUTHORIZED, "Invalid or expired token");
  }

  const isEexist=await organizationUserModels.findOne({email:payload?.email})

  if(!isEexist){
    throw new AppError(status.FORBIDDEN ,"User is not found ")
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const user = await organizationUserModels.findByIdAndUpdate(
    payload.userId,
    { password: hashedPassword, isDeleted: false },
    { new: true }
  );

  if (!user) throw new AppError(status.NOT_FOUND, "User not found");

  return user;
};


// ---------------- Exported Service Object ----------------
export const organizationUserServices = {
  createOrganizationUser,
  getAllOrganizationUsers,
  getSingleOrganizationUser,
  updateOrganizationUser,
  deleteOrganizationUser,
  setupPassword
};
