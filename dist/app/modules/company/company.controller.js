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
exports.CompanyController = void 0;
const companyService = __importStar(require("./company.service"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const company_model_1 = __importDefault(require("./company.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = __importDefault(require("../user/user.model"));
const createCompany = (0, catchAsync_1.default)(async (req, res) => {
    const loggedInUserEmail = req?.user?.email;
    const existingCompany = await company_model_1.default.findOne({
        companyName: req?.body?.companyName,
    });
    console.log(existingCompany);
    // existing company
    if (existingCompany) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "A Company already exists in this name!");
    }
    // user already has a company or not
    const user = await user_model_1.default.findOne({ email: loggedInUserEmail });
    if (user?.companyId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You already have a company set up!");
    }
    const company = await companyService.createCompany(req.body, loggedInUserEmail);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Company created successfully",
        data: company,
    });
});
const getAllCompanies = (0, catchAsync_1.default)(async (req, res) => {
    const companies = await companyService.getAllCompanies();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Companies retrieved successfully",
        data: companies,
    });
});
const getCompanyById = (0, catchAsync_1.default)(async (req, res) => {
    const company = await companyService.getCompanyById(req.params.id);
    if (!company) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Company not found",
            data: null,
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Company retrieved successfully",
        data: company,
    });
});
const updateCompany = (0, catchAsync_1.default)(async (req, res) => {
    const company = await companyService.updateCompany(req.params.id, req.body);
    if (!company) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Company not found",
            data: null,
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Company updated successfully",
        data: company,
    });
});
const deleteCompany = (0, catchAsync_1.default)(async (req, res) => {
    const company = await companyService.deleteCompany(req.params.id);
    if (!company) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Company not found",
            data: null,
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Company deleted successfully",
        data: company,
    });
});
exports.CompanyController = {
    createCompany,
    getCompanyById,
    getAllCompanies,
    updateCompany,
    deleteCompany,
};
