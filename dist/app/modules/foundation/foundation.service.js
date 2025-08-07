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
exports.FoundationService = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const foundation_model_1 = require("./foundation.model");
const user_model_1 = __importDefault(require("../user/user.model"));
const createFoundation = async (data) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // 1. Check if user with this company exists
        const user = await user_model_1.default.findOne({ companyName: data.companyName }).session(session);
        if (!user) {
            throw new Error('Company not found');
        }
        // 2. Create Foundation
        const foundation = await foundation_model_1.FoundationModel.create([data], { session });
        // 3. Update user with foundationId
        user.foundationId = foundation[0]._id;
        await user.save({ session });
        // 4. Commit the transaction
        await session.commitTransaction();
        session.endSession();
        return foundation[0];
    }
    catch (error) {
        // Rollback if any error occurs
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const getSpecificFoundationByCompanyName = async (companyName) => {
    const foundation = await foundation_model_1.FoundationModel.findOne({ companyName });
    if (!foundation) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Foundation with company name ${companyName} not found`);
    }
    return foundation;
};
const updateFoundation = async (id, data) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid foundation ID");
    }
    const foundation = await foundation_model_1.FoundationModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!foundation) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Foundation with ID ${id} not found`);
    }
    return foundation;
};
const deleteFoundation = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid foundation ID");
    }
    const foundation = await foundation_model_1.FoundationModel.findByIdAndDelete(id);
    if (!foundation) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Foundation with ID ${id} not found`);
    }
};
exports.FoundationService = {
    createFoundation,
    getSpecificFoundationByCompanyName,
    updateFoundation,
    deleteFoundation,
};
