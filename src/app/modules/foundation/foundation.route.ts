import express from "express";
import { FoundationController } from "./foundation.controller";
import auth from "../../middlewares/auth";

const router = express.Router();
router.patch("/difrent-capability",auth("companyAdmin"), FoundationController.createDifrentCapabilitysFoundation);
router.patch("/create-identity",auth("companyAdmin"), FoundationController.createIdentity);
router.get("/get-identity",auth("companyAdmin"), FoundationController.getAllIdentity);
router.patch("/create-zero",auth("companyAdmin"), FoundationController.createZeroFoundation);
router.get("/get-zero",auth("companyAdmin"), FoundationController.getAllZeroIn);
router.patch("/create-capability",auth("companyAdmin"), FoundationController.createcapabilitysFoundation);
router.get("/get-capability",auth("companyAdmin"), FoundationController.getAllcapabilitysFoundation);
router.delete("/:id/delete-capability",auth("companyAdmin"), FoundationController.deletecapabilitysFoundation);

router.get("/:id/update-capability",auth("companyAdmin"), FoundationController.updatecapabilitysFoundation);
router.post("/", FoundationController.createFoundation);
router.get("/:companyName", FoundationController.getSpecificFoundationByCompanyName);
router.patch("/:id", FoundationController.updateFoundation);
router.delete("/:id", FoundationController.deleteFoundation);

export const FoundationRoutes = router;