import { ICompany } from "./company.interface";
import { CompanyModel } from "./company.model";
import AppError from "../../errors/AppError";
import status from "http-status";
import { sendEmailForSuperAdmin } from "../../utils/sendMail";

const sendEmailForSuperAdmins = async (payload: ICompany) => {
  if (!payload.companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is required ");
  }

  const sendEmail = await CompanyModel.create(payload);
  await sendEmailForSuperAdmin(
    'hasansanim562@gmail.com', // to
    "New Company Submission", // title
    {
      name: payload.name,
      email: payload.email,
      number: payload.number,
      companyName: payload.companyName,
      message: payload.message,
    }
  );
  return sendEmail
};


export const companyServices={
sendEmailForSuperAdmins
}