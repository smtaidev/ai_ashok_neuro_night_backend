import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { talentOverviewServices } from "./Telent.services";


// ✅ Create Talent Overview
const createTalentOverviewIntoDb = catchAsync(async (req, res) => {
  const company = req.user;
  const result = await talentOverviewServices.createTalentOverviewIntoDb(
    company?.companyName,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Talent Overview created successfully",
    data: result,
  });
});

// ✅ Get All Talent Overview
const getAllTalentOverviewFromDb = catchAsync(async (req, res) => {
  const company = req.user;
  const result = await talentOverviewServices.getAllTalentOverviewsFromDb(
    company?.companyName
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All Talent Overviews retrieved successfully",
    data: result,
  });
});

// ✅ Get Single Talent Overview by ID
const getSingleTalentOverviewFromDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;

  const result = await talentOverviewServices.getSingleTalentOverviewFromDb(
    company?.companyName,
    id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Talent Overview retrieved successfully",
    data: result,
  });
});

// ✅ Update Talent Overview
const updateTalentOverviewIntoDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;

  const result = await talentOverviewServices.updateTalentOverviewIntoDb(
    company?.companyName,
    id,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Talent Overview updated successfully",
    data: result,
  });
});

// ✅ Delete Talent Overview
const deleteTalentOverviewFromDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;

  const result = await talentOverviewServices.deleteTalentOverviewFromDb(
    company?.companyName,
    id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Talent Overview deleted successfully",
    data: result,
  });
});

export const talentOverviewControllers = {
  createTalentOverviewIntoDb,
  getAllTalentOverviewFromDb,
  getSingleTalentOverviewFromDb,
  updateTalentOverviewIntoDb,
  deleteTalentOverviewFromDb,
};
