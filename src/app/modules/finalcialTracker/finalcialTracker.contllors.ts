import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { finalcialTrackerServices } from "./finalcialTracker.services";

const createfinalcialTrackerIntDb=catchAsync(async(req,res)=>{
    const {companyName}=req.user
const result=await finalcialTrackerServices.createfinalcialTracker(companyName,req.body)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "finalcial tracker created successfully",
    data: result,
  });
})

const getfinalcialTrackerIntDb=catchAsync(async(req,res)=>{
    const {id}=req.params
 
const result=await finalcialTrackerServices.getAllfinalcialTracker(id)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "finalcial tracker retrieved successfully",
    data: result,
  });
})
const updatedfinalcialTrackerIntDb=catchAsync(async(req,res)=>{
    const {id}=req.params
    console.log("id",id)
const result=await finalcialTrackerServices.updatefinalcialTracker(id,req.body)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "finalcial tracker updated successfully",
    data: result,
  });
})


const deletedfinalcialTrackerIntDb=catchAsync(async(req,res)=>{
    const {id}=req.params
const result=await finalcialTrackerServices.deletefinalcialTracker(id)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "finalcial tracker deleted successfully",
    data: result,
  });
})

export const finalcialTrackerContllors={
    createfinalcialTrackerIntDb,
    getfinalcialTrackerIntDb,
    updatedfinalcialTrackerIntDb,
    deletedfinalcialTrackerIntDb
}
