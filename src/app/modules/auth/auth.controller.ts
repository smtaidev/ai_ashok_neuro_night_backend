import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";
import AppError from "../../errors/AppError";
import status from "http-status";
import UserModel from "../user/user.model";


const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req?.body;

  if (!email || !password) {
    throw new AppError(status.BAD_REQUEST, "Email and password are required!");
  }


  const result = await AuthServices.loginUserIntoDB({email, password});
  const {  accessToken } = result;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in successfully!",
    data: {
      accessToken,
    },
  });
});


// const forgetPassProcessControl = catchAsync(async (req, res) => {
//   const result = await authServices.loginUserIntoDB(req.body);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message:
//       "Password reset code is sent to your email. Check and use the code properly.",
//     data: null,
//   });
// });

export const AuthController = {
  loginUser,

};
