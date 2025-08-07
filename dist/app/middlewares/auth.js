"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)(async (req, res, next) => {
        let token = req.headers.authorization;
        // Normalize token (handle "Bearer <token>" or raw token)
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "No authorization token provided");
        }
        if (token.startsWith("Bearer ")) {
            token = token.slice(7); // Remove "Bearer " prefix
        }
        // Verify token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Token has expired");
            }
            if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid token");
            }
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Token verification failed");
        }
        const { role, email } = decoded;
        console.log("logged in user: ", decoded);
        // Check if user exists
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        // Check if user is deleted
        if (user.isDeleted) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is deleted");
        }
        // Check role
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Insufficient role permissions");
        }
        req.user = decoded;
        next();
    });
};
exports.default = auth;
