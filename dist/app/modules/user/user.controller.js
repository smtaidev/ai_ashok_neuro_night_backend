"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    console.log(req.body);
    const loggedInUser = req?.user;
    // company admin creation 
    if (loggedInUser?.role !== "superAdmin" && req?.body?.role == "companyAdmin") {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Only super admin can create company admin!");
    }
    if (loggedInUser?.role !== "companyAdmin" && req?.body?.role == "companyEmployee") {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Only company admin can create company employee!");
    }
    const user = await user_service_1.UserServices.createUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: user,
    });
});
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const users = await user_service_1.UserServices.getAllUsers();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Users retrieved successfully",
        data: users,
    });
});
const getUserById = (0, catchAsync_1.default)(async (req, res) => {
    const user = await user_service_1.UserServices.getUserById(req.params.id);
    if (!user) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User not found",
            data: null,
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User retrieved successfully",
        data: user,
    });
});
const updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const user = await user_service_1.UserServices.updateUser(req.params.id, req.body);
    if (!user) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User not found",
            data: null,
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User updated successfully",
        data: user,
    });
});
const deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    const user = await user_service_1.UserServices.deleteUser(req.params.id);
    if (!user) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User not found",
            data: null,
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User deleted successfully",
        data: user,
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await user_service_1.UserServices.changePasswordIntoDB(req.params.id, oldPassword, newPassword);
    if (!user) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "User not found",
            data: null,
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Password changed successfully",
        data: null,
    });
});
exports.UserControllers = {
    createUser,
    getAllUsers,
    getUserById,
    changePassword,
    deleteUser,
    updateUser
};
