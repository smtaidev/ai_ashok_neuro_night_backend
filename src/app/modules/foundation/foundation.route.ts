import express from "express";
import { FoundationController } from "./foundation.controller";
import auth from "../../middlewares/auth";

const router = express.Router();
router.patch("/create-identity",auth("companyAdmin"), FoundationController.createIdentity);
router.patch("/create-zero",auth("companyAdmin"), FoundationController.createZeroFoundation);
router.post("/", FoundationController.createFoundation);
router.get("/:companyName", FoundationController.getSpecificFoundationByCompanyName);
router.patch("/:id", FoundationController.updateFoundation);
router.delete("/:id", FoundationController.deleteFoundation);

export const FoundationRoutes = router;