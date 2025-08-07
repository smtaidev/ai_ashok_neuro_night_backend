"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)("superAdmin"), user_controller_1.UserControllers.createUser);
router.get("/", (0, auth_1.default)("superAdmin"), user_controller_1.UserControllers.getAllUsers);
router.get("/:id", user_controller_1.UserControllers.getUserById);
router.patch("/:id", (0, auth_1.default)("superAdmin", "companyAdmin", "companyEmployee"), user_controller_1.UserControllers.updateUser);
router.delete("/:id", user_controller_1.UserControllers.deleteUser);
router.patch("/:id/password", user_controller_1.UserControllers.changePassword);
exports.UserRoutes = router;
