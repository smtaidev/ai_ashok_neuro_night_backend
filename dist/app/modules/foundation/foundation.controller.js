"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoundationController = void 0;
const foundation_service_1 = require("./foundation.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const createFoundation = (0, catchAsync_1.default)(async (req, res, next) => {
    const foundation = await foundation_service_1.FoundationService.createFoundation(req.body);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Foundation created successfully",
        data: foundation,
    });
});
const getSpecificFoundationByCompanyName = (0, catchAsync_1.default)(async (req, res, next) => {
    const { companyName } = req.params;
    const foundation = await foundation_service_1.FoundationService.getSpecificFoundationByCompanyName(companyName);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Foundation fetched successfully",
        data: foundation,
    });
});
const updateFoundation = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const foundation = await foundation_service_1.FoundationService.updateFoundation(id, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Foundation updated successfully",
        data: foundation,
    });
});
const deleteFoundation = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    await foundation_service_1.FoundationService.deleteFoundation(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Foundation deleted successfully",
    });
});
exports.FoundationController = {
    createFoundation,
    getSpecificFoundationByCompanyName,
    updateFoundation,
    deleteFoundation,
};
