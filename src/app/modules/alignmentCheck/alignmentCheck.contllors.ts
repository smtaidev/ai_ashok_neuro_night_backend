import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { alignmentCheckServices } from "./alignmentCheck.services";

const createalignmentCheckIntDb = catchAsync(async (req, res) => {
  console.log(req.body);
  
  const { companyName, userId } = req.user;
  console.log(companyName)
  const result = await alignmentCheckServices.createalignmentCheck(
    companyName,
    userId,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "alignmentCheck created successfully",
    data: result,
  });
});

const getalignmentCheckIntDb = catchAsync(async (req, res) => {
  const company = req.user;

  console.log(company);
  const result = await alignmentCheckServices.getAllalignmentCheck(
    company.companyName
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "alignmentCheck retrieved successfully",
    data: result,
  });
});
const getMyAlignmentCheckIntDb = catchAsync(async (req, res) => {
  const company = req.user;

  console.log(company);
  const result = await alignmentCheckServices.myAlignmentCheck(company?.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "alignmentCheck retrieved successfully",
    data: result,
  });
});
// const getSinglealignmentCheckIntDb=catchAsync(async(req,res)=>{
//     const {id}=req.params

// const result=await alignmentCheckServices.getSinglealignmentCheck(id)
//  sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "alignmentCheck retrieved successfully",
//     data: result,
//   });
// })
const updatedalignmentCheckIntDb = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  const result = await alignmentCheckServices.updatealignmentCheck(
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "alignmentCheck updated successfully",
    data: result,
  });
});

const deletedalignmentCheckIntDb = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await alignmentCheckServices.deletealignmentCheck(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "alignmentCheck deleted successfully",
    data: result,
  });
});

export const alignmentCheckContllors = {
  createalignmentCheckIntDb,
  updatedalignmentCheckIntDb,
  deletedalignmentCheckIntDb,
  getalignmentCheckIntDb,
  getMyAlignmentCheckIntDb,
};
