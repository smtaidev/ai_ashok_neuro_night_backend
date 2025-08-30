import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { companyInfoServices } from "./company-info.services";

// ✅ Update Company Info
const updateCompanyInfoInDb = catchAsync(async (req, res) => {
  const { companyName } = req.user;
  const result = await companyInfoServices.updateCompanyInfo(companyName, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Company info updated successfully",
    data: result,
  });
});

// ✅ Get Company Info
const getCompanyInfoFromDb = catchAsync(async (req, res) => {
  const { companyName } = req.user;
  const result = await companyInfoServices.getCompanyInfo(companyName);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Company info retrieved successfully",
    data: result,
  });
});

export const companyInfoContllors={
    updateCompanyInfoInDb,
    getCompanyInfoFromDb
}