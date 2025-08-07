import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import AppError from "../../errors/AppError";
import status from "http-status";


const createUser = catchAsync(async (req: Request, res: Response) => {
console.log(req.body)
  const loggedInUser = req?.user

  // company admin creation 
  if(loggedInUser?.role !== "superAdmin" && req?.body?.role == "companyAdmin"){
    throw new AppError(status.UNAUTHORIZED,"Only super admin can create company admin!")
  }

  if(loggedInUser?.role !== "companyAdmin" && req?.body?.role == "companyEmployee"){
    throw new AppError(status.UNAUTHORIZED,"Only company admin can create company employee!")
  }

  const user = await UserServices.createUser(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: user,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserServices.getAllUsers();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: users,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.getUserById(req.params.id);
  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
      data: null,
    });
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.updateUser(req.params.id, req.body);
  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
      data: null,
    });
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.deleteUser(req.params.id);
  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
      data: null,
    });
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
    data: user,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const user = await UserServices.changePasswordIntoDB(
    req.params.id,
    oldPassword,
    newPassword
  );
  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
      data: null,
    });
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully",
    data: null,
  });
});



export const UserControllers ={
  createUser,
  getAllUsers,
  getUserById,
  changePassword,
  deleteUser,
  updateUser
}