import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { organizationUserServices } from "./organization-role.services";


// ✅ Create Organization User
const createOrganizationUser = catchAsync(async (req, res) => {
  const company = req.user;
  const result = await organizationUserServices.createOrganizationUser(
    company?.companyName,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Organization user created successfully",
    data: result,
  });
});

// ✅ Get All Organization Users
const getAllOrganizationUsers = catchAsync(async (req, res) => {
  const company = req.user;
  const result = await organizationUserServices.getAllOrganizationUsers(
    company?.companyName
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All organization users retrieved successfully",
    data: result,
  });
});

// ✅ Get Single Organization User
const getSingleOrganizationUser = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  const result = await organizationUserServices.getSingleOrganizationUser(
    company?.companyName,
    id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Organization user retrieved successfully",
    data: result,
  });
});

// ✅ Update Organization User
const updateOrganizationUser = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  const result = await organizationUserServices.updateOrganizationUser(
    company?.companyName,
    id,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Organization user updated successfully",
    data: result,
  });
});

// ✅ Delete Organization User
const deleteOrganizationUser = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  const result = await organizationUserServices.deleteOrganizationUser(
    company?.companyName,
    id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Organization user deleted successfully",
    data: result,
  });
});
const setupNewPasswordUser = catchAsync(async (req, res) => {
  const { token } = req.params;
  const result = await organizationUserServices.setupPassword(
    token,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your password is success fully updated is done ",
  
  });
});

export const organizationUserControllers = {
  createOrganizationUser,
  getAllOrganizationUsers,
  getSingleOrganizationUser,
  updateOrganizationUser,
  deleteOrganizationUser,
  setupNewPasswordUser
};
