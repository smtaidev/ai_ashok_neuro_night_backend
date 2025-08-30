import express from "express";
import auth from "../../middlewares/auth";
import { businessFunctionControllers } from "./businessfuncation.contllors";

const router = express.Router();

// ✅ Create Business Function
router.post(
  "/create-business-function",
  auth("companyAdmin"),
  businessFunctionControllers.createBusinessFunctionIntoDb
);

// ✅ Get All Business Functions
router.get(
  "/get-all-business-function",
  auth("companyAdmin","companyEmployee"),
  businessFunctionControllers.getAllBusinessFunctionsFromDb
);

// ✅ Get Single Business Function by ID
router.get(
  "/:id",
  auth("companyAdmin","companyEmployee"),
  businessFunctionControllers.getSingleBusinessFunctionFromDb
);

// ✅ Update Business Function by ID
router.patch(
  "/:id",
  auth("companyAdmin","companyEmployee"),
  businessFunctionControllers.updateBusinessFunctionIntoDb
);

// ✅ Delete Business Function by ID
router.delete(
  "/:id",
  auth("companyAdmin"),
  businessFunctionControllers.deleteBusinessFunctionFromDb
);

export const businessFunctionRoute = router;
