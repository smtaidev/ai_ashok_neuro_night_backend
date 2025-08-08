
// import catchAsync from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
// import { alignmentCeckServices } from "./alignmentCeck.services";

// const createalignmentCeckIntDb=catchAsync(async(req,res)=>{
//     console.log(req.body)
// const result=await alignmentCeckServices.createalignmentCeck(req.body)

//  sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "alignmentCeck created successfully",
//     data: result,
//   });
// })

// const getalignmentCeckIntDb=catchAsync(async(req,res)=>{
//     const {id}=req.params
 
// const result=await alignmentCeckServices.getAllalignmentCeck()
//  sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "alignmentCeck retrieved successfully",
//     data: result,
//   });
// })
// const getSinglealignmentCeckIntDb=catchAsync(async(req,res)=>{
//     const {id}=req.params
 
// const result=await alignmentCeckServices.getSinglealignmentCeck(id)
//  sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "alignmentCeck retrieved successfully",
//     data: result,
//   });
// })
// const updatedalignmentCeckIntDb=catchAsync(async(req,res)=>{
//     const {id}=req.params
//     console.log("id",id)
// const result=await alignmentCeckServices.updatealignmentCeck(id,req.body)
//  sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "alignmentCeck updated successfully",
//     data: result,
//   });
// })


// const deletedalignmentCeckIntDb=catchAsync(async(req,res)=>{
//     const {id}=req.params
// const result=await alignmentCeckServices.deletealignmentCeck(id)
//  sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "alignmentCeck deleted successfully",
//     data: result,
//   });
// })

// export const alignmentCeckContllors={
//     createalignmentCeckIntDb,
//     getalignmentCeckIntDb,
//     updatedalignmentCeckIntDb,
//     deletedalignmentCeckIntDb,
//     getSinglealignmentCeckIntDb
// }
