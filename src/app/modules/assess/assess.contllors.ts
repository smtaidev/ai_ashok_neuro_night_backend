
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AssessServices } from "./assess.services";

const createAssessIntDb=catchAsync(async(req,res)=>{
    console.log(req.body)
const result=await AssessServices.createAssess(req.body)

 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Assess created successfully",
    data: result,
  });
})

const getAssessIntDb=catchAsync(async(req,res)=>{
    const {id}=req.params
 
const result=await AssessServices.getAllAssess()
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Assess retrieved successfully",
    data: result,
  });
})
const getSingleAssessIntDb=catchAsync(async(req,res)=>{
    const {id}=req.params
 
const result=await AssessServices.getSingleAssess(id)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Assess retrieved successfully",
    data: result,
  });
})
const updatedAssessIntDb=catchAsync(async(req,res)=>{
    const {id}=req.params
    console.log("id",id)
const result=await AssessServices.updateAssess(id,req.body)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Assess updated successfully",
    data: result,
  });
})


const deletedAssessIntDb=catchAsync(async(req,res)=>{
    const {id}=req.params
const result=await AssessServices.deleteAssess(id)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Assess deleted successfully",
    data: result,
  });
})


 //----------------trends contllors section  -----------------------------------------------------------
 const createTrendIntDb=catchAsync(async(req,res)=>{
    const company=req.user 
    console.log("company data",company)
    console.log("create trend data ",req.body)
const result=await AssessServices.createtrendIntoDb(company.companyName,req.body)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "trend  successfully updated !",
    data: result,
  });
})

export const AssessContllors={
    createAssessIntDb,
    getAssessIntDb,
    updatedAssessIntDb,
    deletedAssessIntDb,
    getSingleAssessIntDb,
    createTrendIntDb
}
