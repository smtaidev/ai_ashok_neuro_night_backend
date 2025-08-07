"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const auth_utils_1 = require("../../utils/auth.utils");
const config_1 = __importDefault(require("../../../config"));
const user_model_1 = __importDefault(require("../user/user.model"));
const loginUserIntoDB = async (payload) => {
    const { email, password } = payload;
    const user = await user_model_1.default.findOne({ email, isDeleted: false });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User with this email does not exist!");
    }
    const isPasswordMatched = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect password!");
    }
    const jwtPayload = {
        email: user.email,
        userName: user.userName,
        role: user.role,
        companyName: user?.companyName,
        companyRole: user.companyRole
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
};
exports.AuthServices = {
    loginUserIntoDB,
};
