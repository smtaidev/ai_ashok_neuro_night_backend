"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompany = exports.updateCompany = exports.getCompanyById = exports.getAllCompanies = exports.createCompany = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = __importDefault(require("../user/user.model"));
const company_model_1 = __importDefault(require("./company.model"));
const mongoose_1 = require("mongoose");
const createCompany = async (companyData, loggedInUserEmail) => {
    // Input validation
    if (!companyData || typeof companyData !== 'object') {
        throw new Error('Invalid company data provided');
    }
    if (!loggedInUserEmail || typeof loggedInUserEmail !== 'string') {
        throw new Error('Invalid user email provided');
    }
    // Start MongoDB session
    const session = await company_model_1.default.startSession();
    try {
        session.startTransaction();
        // Create company
        const createdCompany = await company_model_1.default.create([companyData], { session });
        // Update user with company ID
        const updatedUser = await user_model_1.default.findOneAndUpdate({ email: loggedInUserEmail }, { $set: { companyId: createdCompany[0]._id } }, { session, new: true });
        // Check if user was found and updated
        if (!updatedUser) {
            throw new Error('User not found');
        }
        // Commit transaction
        await session.commitTransaction();
        return createdCompany[0];
    }
    catch (error) {
        // Abort transaction on error
        await session.abortTransaction();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create company!');
    }
    finally {
        // Always end the session
        await session.endSession();
    }
};
exports.createCompany = createCompany;
const getAllCompanies = async () => {
    const companies = await company_model_1.default.find({ isDeleted: false });
    console.log(companies);
    return companies;
};
exports.getAllCompanies = getAllCompanies;
const getCompanyById = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid company ID");
    }
    const company = await company_model_1.default.findOne({ _id: id, isDeleted: false });
    return company;
};
exports.getCompanyById = getCompanyById;
const updateCompany = async (id, updateData) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid company ID");
    }
    const company = await company_model_1.default.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: updateData }, { new: true, runValidators: true });
    return company;
};
exports.updateCompany = updateCompany;
const deleteCompany = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid company ID");
    }
    const company = await company_model_1.default.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: { isDeleted: true } }, { new: true });
    return company;
};
exports.deleteCompany = deleteCompany;
