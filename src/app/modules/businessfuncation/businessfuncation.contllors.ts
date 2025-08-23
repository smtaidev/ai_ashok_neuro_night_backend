
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { businessFunctionServices } from "./businessfuncation.services";


// ✅ Create Business Function
const createBusinessFunctionIntoDb = catchAsync(async (req, res) => {
  const company = req.user;
  const result = await businessFunctionServices.createBusinessFunctionIntoDb(
    company?.companyName,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Business Function created successfully",
    data: result,
  });
});

// ✅ Get All Business Functions
const getAllBusinessFunctionsFromDb = catchAsync(async (req, res) => {
  const company = req.user;
  const result = await businessFunctionServices.getAllBusinessFunctionsFromDb(
    company?.companyName
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All Business Functions retrieved successfully",
    data: result,
  });
});

// ✅ Get Single Business Function
const getSingleBusinessFunctionFromDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  const result = await businessFunctionServices.getSingleBusinessFunctionFromDb(
    company?.companyName,
    id
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Business Function retrieved successfully",
    data: result,
  });
});

// ✅ Update Business Function
const updateBusinessFunctionIntoDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  const result = await businessFunctionServices.updateBusinessFunctionIntoDb(
    company?.companyName,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Business Function updated successfully",
    data: result,
  });
});

// ✅ Delete Business Function
const deleteBusinessFunctionFromDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  const result = await businessFunctionServices.deleteBusinessFunctionFromDb(
    company?.companyName,
    id
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Business Function deleted successfully",
    data: result,
  });
});

export const businessFunctionControllers = {
  createBusinessFunctionIntoDb,
  getAllBusinessFunctionsFromDb,
  getSingleBusinessFunctionFromDb,
  updateBusinessFunctionIntoDb,
  deleteBusinessFunctionFromDb,
};
