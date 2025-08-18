import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { planServices } from "./plan.services";

const planCreate=catchAsync(async(req,res)=>{

    const result =await planServices.createPlan(req.body)
  res.status(status.OK).json({
    success: true,
    message: "deleted capability foundation successfully updated",
    data:result
  });


})


// Get all plans
 const getAllPlans = catchAsync(async (req, res) => {
  const result = await planServices.getAllPlans();
  res.status(status.OK).json({
    success: true,
    message: "Plans retrieved successfully",
    data: result,
  });
});

// Get single plan
 const getSinglePlan = catchAsync(async (req, res) => {
    const {id}=req.params
  const result = await planServices.getSinglePlan(id);
  res.status(status.OK).json({
    success: true,
    message: "Plan retrieved successfully",
    data: result,
  });
});

// Update a plan
 const updatePlan = catchAsync(async (req, res) => {
    const {id}=req.params
  const result = await planServices.updatePlan(id, req.body);
  res.status(status.OK).json({
    success: true,
    message: "Plan updated successfully",
    data: result,
  });
});

// Delete a plan
 const deletePlan = catchAsync(async (req, res) => {
     const {id}=req.params
  const result = await planServices.deletePlan(id);
  res.status(status.OK).json({
    success: true,
    message: "Plan deleted successfully",
    data: result,
  });
});

export const planContllors={
    planCreate,
    updatePlan,
    getAllPlans,
    getSinglePlan,
    deletePlan

}