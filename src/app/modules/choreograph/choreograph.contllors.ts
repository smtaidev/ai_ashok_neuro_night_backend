import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { choreographServices } from "./choreograph.services";

const createChoregoraphDb=catchAsync(async(req,res)=>{
    const company=req.user 
console.log("check company data",company)
const result=await choreographServices.createTeamsIntoDb(company.companyName,req.body)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "choregoraph successfully created !",
    data: result,
  });
})
const getAllChoregoraphDb=catchAsync(async(req,res)=>{
    const company=req.user 
console.log("check company data",company)
const result=await choreographServices.getAllTeamsIntoDb(company.companyName)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "all choregoraph successfully get!",
    data: result,
  });
})
const getSingeleChoregoraphDb=catchAsync(async(req,res)=>{
    const company=req.user 
    const {id}=req.params
console.log("check company data",company)
const result=await choreographServices.getTeamByCompanyAndId(company.companyName,id)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: " choregoraph singe team successfully get!",
    data: result,
  });
})
const updateChoregoraphDb=catchAsync(async(req,res)=>{
    const company=req.user 
const {id}=req.params
const result=await choreographServices.updateTeamInDb(company.companyName,id,req.body)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "choregoraph team successfully updated !",
    data: result,
  });
})
const deleteChoregorapTeamhDb=catchAsync(async(req,res)=>{
    const company=req.user 
const {id}=req.params
console.log(id)
const result=await choreographServices.deleteTeamInDb(company.companyName,id)
 sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "delete successfully !",
    data: null
  });
})

export const choregoraphContllors={
    createChoregoraphDb,
    updateChoregoraphDb,
    getAllChoregoraphDb,
    getSingeleChoregoraphDb,
    deleteChoregorapTeamhDb

}