"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoundationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const foundation_controller_1 = require("./foundation.controller");
const router = express_1.default.Router();
router.post("/", foundation_controller_1.FoundationController.createFoundation);
router.get("/:companyName", foundation_controller_1.FoundationController.getSpecificFoundationByCompanyName);
router.patch("/:id", foundation_controller_1.FoundationController.updateFoundation);
router.delete("/:id", foundation_controller_1.FoundationController.deleteFoundation);
exports.FoundationRoutes = router;
