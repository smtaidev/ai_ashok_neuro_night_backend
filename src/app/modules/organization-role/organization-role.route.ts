import express from "express";
import auth from "../../middlewares/auth";
import { organizationUserControllers } from "./organization-role.contllors";

const router = express.Router();

// ✅ Create Organization User
router.post(
  "/create-organization-user",
  auth("companyAdmin"),
  organizationUserControllers.createOrganizationUser
);

// ✅ Get All Organization Users
router.get(
  "/get-all-organization-users",
  auth("companyAdmin"),
  organizationUserControllers.getAllOrganizationUsers
);

// ✅ Get Single Organization User by ID
router.get(
  "/:id",
  auth("companyAdmin",'companyEmployee'),
  organizationUserControllers.getSingleOrganizationUser
);

// ✅ Update Organization User by ID
router.patch(
  "/:id",
  auth("companyAdmin"),
  organizationUserControllers.updateOrganizationUser
);

// ✅ Delete Organization User by ID
router.delete(
  "/:id",
  auth("companyAdmin"),
  organizationUserControllers.deleteOrganizationUser
);

export const organizationUserRoute = router;
