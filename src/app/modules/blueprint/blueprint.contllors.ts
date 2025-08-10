import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { blueprintServices } from "./blueprint.services";

const createVisonDb=catchAsync(async(req,res)=>{
    const company=req.user 
  console.log("check vison",req.body)
const result=await blueprintServices.createVision(company.companyName,req.body)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "vison  successfully updated !",
    data: result,
  });
})
const creatstategicThemeDb=catchAsync(async(req,res)=>{
    const company=req.user 

const result=await blueprintServices.createstategicTheme(company.companyName,req.body)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "stategic Theme  successfully updated !",
    data: result,
  });
})
const updatetstategicThemeDb=catchAsync(async(req,res)=>{
    const company=req.user 
const {id}=req.params
const result=await blueprintServices.updatestategicTheme(id,company.companyName,req.body)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "stategic Theme  successfully updated !",
    data: result,
  });
})
const createbusinessGoalDb=catchAsync(async(req,res)=>{
    const company=req.user 
console.log("check company data",company)
const result=await blueprintServices.createbusinessGoal(company.companyName,req.body)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "bussens gold   successfully updated !",
    data: result,
  });
})
const updatebusinessGoalDb=catchAsync(async(req,res)=>{
    const company=req.user 
const {id}=req.params
const result=await blueprintServices.updateBusinessGoal(id,company.companyName,req.body)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "stategic Theme  successfully updated !",
    data: result,
  });
})


export const blueprintContllors={
    createVisonDb,
    creatstategicThemeDb,
    updatetstategicThemeDb,
    createbusinessGoalDb,
    updatebusinessGoalDb
}