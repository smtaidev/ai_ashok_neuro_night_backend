import { UpdateCompanyInfo } from "./company-info.interface ";
import { companyInfoModel } from "./company-info.model";


// Update or Create Company Info
export const updateCompanyInfo = async (
  companyName: string,
  payload: UpdateCompanyInfo
) => {
  if (!companyName) {
    throw new Error("Company name is required");
  }

  const result = await companyInfoModel.findOneAndUpdate(
    { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } },
    { $set:{ ...payload, companyName} },
    { upsert: true, new: true }
  );

  return result;
};

// Get Company Info
export const getCompanyInfo = async (companyName: string) => {
  if (!companyName) {
    throw new Error("Company name is required");
  }

  const result = await companyInfoModel.findOne({
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  }).lean();

  return result;
};

export const companyInfoServices={
    updateCompanyInfo,
    getCompanyInfo
}