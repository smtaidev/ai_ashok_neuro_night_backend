import express from "express";
import { FoundationController } from "./foundation.controller";

const router = express.Router();

router.post("/", FoundationController.createFoundation);
router.get("/:companyName", FoundationController.getSpecificFoundationByCompanyName);
router.patch("/:id", FoundationController.updateFoundation);
router.delete("/:id", FoundationController.deleteFoundation);

export const FoundationRoutes = router;