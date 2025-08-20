import status from "http-status";
import AppError from "../../errors/AppError";
import { IOrganizationUser } from "./organization-role.interface";
import { organizationUserModel } from "./organization-role.model";
import UserModel from "../user/user.model";
import mongoose from "mongoose";

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
    password: "dsjfslfj",
    companyName: companyName,
  };
  

  const isEexistUser = await UserModel.findOne({
    $or: [
      { email: userData.email },
      { companyName: { $regex: new RegExp(`^${userData.companyName}$`, "i") } },
    ],
  });

  if (isEexistUser) {
    throw new AppError(status.BAD_REQUEST, "User already exists");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const newUser = new UserModel(userData, { session });
    const user = await newUser.save();
const result = await organizationUserModel.create({...payload,userId:user._id},{session});
    await session.commitTransaction();
    session.endSession();

    return result
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error);
  }
};

const getAllOrganizationUsers = async (companyName:string) => {
      if (!companyName) {
        throw new AppError(status.BAD_REQUEST, "company name is not found !");
      }
      const query = {
        companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
      };
  const result = await organizationUserModel.find(query).populate("userId").select('-password');
  return result;
};

const getSingleOrganizationUser = async (companyName:string,id: string) => {
     if (!companyName) {
        throw new AppError(status.BAD_REQUEST, "company name is not found !");
      }
      const query = {
        companyName: { $regex: new RegExp(`^${companyName}$`, "i") ,
        _id:new mongoose.Types.ObjectId(id)
    },
      };
  const result = await UserModel.findOne(query).select("-password").populate("userId");
  if (!result) {
    throw new AppError(status.NOT_FOUND, "User not found!");
  }
  return result;
};

const updateOrganizationUser = async (
companyName:string,
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
        userId:new mongoose.Types.ObjectId(userId)
    }


const isEexist=await UserModel.findOne({_id:userId})
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

const deleteOrganizationUser = async (companyName:string,id: string) => {


     if (!companyName) {
        throw new AppError(status.BAD_REQUEST, "company name is not found !");
      }


      const query = {
        companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
        _id:new mongoose.Types.ObjectId(id)
    }

    
      const quers = {
        companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
        userId:new mongoose.Types.ObjectId(id)
    }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const DeleteUser = await UserModel.deleteOne(query)
 await organizationUserModel.deleteOne(quers)
    await session.commitTransaction();
    session.endSession();

    return DeleteUser
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error);
  }

//   const result = await organizationUserModel.deleteOne()
//   if (!result) {
//     throw new AppError(status.NOT_FOUND, "User not found!");
//   }
//   return result;
}

// ---------------- Exported Service Object ----------------
export const organizationUserServices = {
  createOrganizationUser,
  getAllOrganizationUsers,
  getSingleOrganizationUser,
  updateOrganizationUser,
  deleteOrganizationUser,
};
