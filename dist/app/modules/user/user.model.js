"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    companyName: { type: String, required: true, unique: true },
    companyRole: { type: String, required: true, default: null },
    foundationId: { type: mongoose_1.Schema.Types.ObjectId, default: null },
    role: {
        type: String,
        enum: ["companyAdmin", "superAdmin", "companyEmployee"],
        required: true,
    },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt_1.default.hash(this.password, 10);
    }
    next();
});
// Create the model
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
