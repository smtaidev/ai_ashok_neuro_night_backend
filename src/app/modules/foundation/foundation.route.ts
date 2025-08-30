import express from "express";
import { FoundationController } from "./foundation.controller";
import auth from "../../middlewares/auth";

const router = express.Router();
router.patch("/difrent-capability",auth("companyAdmin"), FoundationController.createDifrentCapabilitysFoundation);
router.patch("/create-identity",auth("companyAdmin"), FoundationController.createIdentity);
router.get("/get-identity",auth("companyAdmin","companyEmployee"), FoundationController.getAllIdentity);
router.patch("/create-zero",auth("companyAdmin","companyEmployee"), FoundationController.createZeroFoundation);
router.get("/get-zero",auth("companyAdmin","companyEmployee"), FoundationController.getAllZeroIn);
router.patch("/create-capability",auth("companyAdmin","companyEmployee"), FoundationController.createcapabilitysFoundation);
router.get("/get-capability",auth("companyAdmin","companyEmployee"), FoundationController.getAllcapabilitysFoundation);
router.delete("/:id/delete-capability",auth("companyAdmin"), FoundationController.deletecapabilitysFoundation);

router.patch("/:id/update-capability",auth("companyAdmin","companyEmployee"), FoundationController.updatecapabilitysFoundation);
router.post("/", FoundationController.createFoundation);
router.get("/:companyName",auth("companyAdmin","companyEmployee") ,FoundationController.getSpecificFoundationByCompanyName);
router.patch("/:id", FoundationController.updateFoundation);
router.delete("/:id", FoundationController.deleteFoundation);

export const FoundationRoutes = router;