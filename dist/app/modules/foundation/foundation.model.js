"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoundationModel = void 0;
const mongoose_1 = require("mongoose");
const FoundationSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    identity: {
        mission: { type: String },
        value: { type: String },
        purpose: { type: String },
    },
    zeroIn: {
        targetCustomer: { type: String },
        keyCustomerNeed: { type: String },
        valueProposition: { type: String },
    },
    capability: {
        coreCapabilities: { type: [String] },
        differentiatingCapabilities: { type: [String] },
    },
}, {
    timestamps: true,
});
exports.FoundationModel = (0, mongoose_1.model)('Foundation', FoundationSchema);
