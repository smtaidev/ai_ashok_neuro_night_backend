"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRoutes = void 0;
const express_1 = require("express");
const company_controller_1 = require("./company.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)("companyAdmin"), company_controller_1.CompanyController.createCompany);
router.get("/", company_controller_1.CompanyController.getAllCompanies);
router.get("/:id", company_controller_1.CompanyController.getCompanyById);
router.patch("/:id", company_controller_1.CompanyController.updateCompany);
router.delete("/:id", company_controller_1.CompanyController.deleteCompany);
exports.CompanyRoutes = router;
