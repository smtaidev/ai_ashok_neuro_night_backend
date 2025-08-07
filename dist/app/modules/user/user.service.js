"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createUser = async (userData) => {
    const companyRole = (userData.role == 'companyAdmin') ? "admin" : null;
    const isEexistUser = await user_model_1.default.findOne({ $or: [
            { email: userData.email },
            { companyName: { $regex: new RegExp(`^${userData.companyName}$`, 'i') } }
        ] });
    if (isEexistUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already exists");
    }
    const user = await user_model_1.default.create({ ...userData, companyRole });
    return user;
};
const getAllUsers = async () => {
    const users = await user_model_1.default.find({ isDeleted: false });
    return users;
};
const getUserById = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID");
    }
    const user = await user_model_1.default.findOne({ _id: id, isDeleted: false });
    return user;
};
const updateUser = async (id, updateData) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID");
    }
    const user = await user_model_1.default.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: updateData }, { new: true, runValidators: true });
    return user;
};
const deleteUser = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID");
    }
    const user = await user_model_1.default.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: { isDeleted: true } }, { new: true });
    return user;
};
const changePasswordIntoDB = async (id, oldPassword, newPassword) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID");
    }
    const user = await user_model_1.default.findOne({ _id: id, isDeleted: false });
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt_1.default.compare(oldPassword, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid current password");
    }
    user.password = newPassword;
    await user.save();
    return user;
};
exports.UserServices = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    changePasswordIntoDB,
};
