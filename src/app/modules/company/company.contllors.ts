import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { companyServices } from "./company.services";

const sendEmailForSuperAdmins=catchAsync(async(req,res)=>{
    const result=await companyServices.sendEmailForSuperAdmins(req.body)
sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your email success fully send for admin ",
    data: result,
  });
})
export const companyContllors={ 
    sendEmailForSuperAdmins
}