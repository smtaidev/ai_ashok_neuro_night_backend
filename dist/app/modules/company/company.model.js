"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const companySchema = new mongoose_1.Schema({
    companyName: { type: String, required: true, unique: true },
    isDeleted: {}
}, {
    timestamps: true
});
const CompanyModel = (0, mongoose_1.model)("Company", companySchema);
exports.default = CompanyModel;
