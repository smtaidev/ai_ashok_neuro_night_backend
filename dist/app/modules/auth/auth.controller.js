"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("./auth.service");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_2 = __importDefault(require("http-status"));
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const { email, password } = req?.body;
    if (!email || !password) {
        throw new AppError_1.default(http_status_2.default.BAD_REQUEST, "Email and password are required!");
    }
    const result = await auth_service_1.AuthServices.loginUserIntoDB({ email, password });
    const { accessToken } = result;
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
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
exports.AuthController = {
    loginUser,
};
