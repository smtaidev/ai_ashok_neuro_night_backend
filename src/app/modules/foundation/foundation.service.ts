import mongoose, { Types } from "mongoose";
import { IFoundation } from "./foundation.interface";
import AppError from "../../errors/AppError";
import status from "http-status";
import { FoundationModel } from "./foundation.model";
import UserModel from "../user/user.model";
import { id } from "zod/v4/locales/index.cjs";
import config from "../../../config";
import axios from "axios";
import { DifferentiatingModel } from "../ai.response/ai.model";

const createFoundation = async (data: IFoundation): Promise<IFoundation> => {
  console.log(data);
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Check if user with this company exists
    const user = await UserModel.findOne({
      companyName: data.companyName,
    }).session(session);

    if (!user) {
      throw new Error("Company not found");
    }

    // 2. Create Foundation
    const foundation = await FoundationModel.create([data], { session });

    // 3. Update user with foundationId
    user.foundationId = foundation[0]._id as Types.ObjectId;
    await user.save({ session });

    // 4. Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return foundation[0];
  } catch (error) {
    // Rollback if any error occurs
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getSpecificFoundationByCompanyName = async (
  companyName: string
): Promise<IFoundation | null> => {
  const foundation = await FoundationModel.findOne({ companyName });
  if (!foundation) {
    throw new AppError(
      status.NOT_FOUND,
      `Foundation with company name ${companyName} not found`
    );
  }
  return foundation;
};

const updateFoundation = async (
  id: string,
  data: Partial<IFoundation>
): Promise<IFoundation | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid foundation ID");
  }
  const foundation = await FoundationModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!foundation) {
    throw new AppError(status.NOT_FOUND, `Foundation with ID ${id} not found`);
  }
  return foundation;
};

const deleteFoundation = async (id: string): Promise<void> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid foundation ID");
  }
  const foundation = await FoundationModel.findByIdAndDelete(id);
  if (!foundation) {
    throw new AppError(status.NOT_FOUND, `Foundation with ID ${id} not found`);
  }
};

// const createIdentityIntoDb = async (
//   companyName: string,
//   payload: { mission?: string; value?: string; purpose?: string[] }
// ) => {

//   console.log(payload)
//   if (!companyName) {
//     throw new AppError(status.BAD_REQUEST, "Company name is not found!");
//   }

//   const query = {
//     companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
//   };

//   const updateData: any = {};

//   if (payload.mission !== undefined) updateData["identity.mission"] = payload.mission;
//   if (payload.value !== undefined) updateData["identity.value"] = payload.value;
//   if (payload.purpose !== undefined) updateData["identity.purpose"] = payload.purpose;

//   const result = await FoundationModel.findOneAndUpdate(
//     query,
//     { $set: updateData },
//     { new: true } // na thakle add hobe
//   );

//   return result;
// };

const createIdentityIntoDb = async (
  companyName: string,
  payload: { mission?: string; value?: string; purpose?: string[] }
) => {
  console.log(payload);

  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  // Je field gulo ache, sudhu oigulo update hobe
  const updateData: any = {};
  if (payload.mission !== undefined)
    updateData["identity.mission"] = payload.mission;
  if (payload.value !== undefined) updateData["identity.value"] = payload.value;
  if (payload.purpose !== undefined)
    updateData["identity.purpose"] = payload.purpose;
  const result = await FoundationModel.findOneAndUpdate(
    { companyName: companyName },
    { $set: updateData },
    { new: true }
  );

  if (!result) {
    throw new AppError(
      status.NOT_FOUND,
      "Company not found to update identity!"
    );
  }

  return result;
};

const createZeroInIntoDb = async (
  companyName: string,
  payload: {
    targetCustomer?: string;
    keyCustomerNeed?: string;
    valueProposition?: string;
  }
) => {
  console.log(payload);

  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName.trim()}$`, "i") },
  };

  // Je field gulo ache, sudhu oigulo update hobe
  const updateData: any = {};
  if (payload.targetCustomer !== undefined)
    updateData["zeroIn.targetCustomer"] = payload.targetCustomer;
  if (payload.keyCustomerNeed !== undefined)
    updateData["zeroIn.keyCustomerNeed"] = payload.keyCustomerNeed;
  if (payload.valueProposition !== undefined)
    updateData["zeroIn.valueProposition"] = payload.valueProposition;

  const result = await FoundationModel.findOneAndUpdate(
    query,
    { $set: updateData },
    { new: true } // only update existing document, no create
  );

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Company not found to update zeroIn!");
  }

  return result;
};


const getAllIdentityFromDb = async (companyName:string) => {
    const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };
  const result = await FoundationModel.find(query, { companyName: 1, identity: 1, _id: 0 });
  return result;
};

const getAllZeroInFromDb = async (companyName:string) => {
    const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };
  const result = await FoundationModel.find(query, { companyName: 1, zeroIn: 1, _id: 0 });
  return result;
};
const createcapabilitys = async (
  companyName: string,
  payload: { capability: string; type: string }
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const result = await FoundationModel.findOneAndUpdate(
    query,
    { $push: { capabilitys: payload } },
    { new: true }
  );

  if (!result) {
    throw new AppError(
      status.NOT_FOUND,
      "Company not found to update capabilitys!"
    );
  }


const capabilityData = await FoundationModel.findOne(query);

const differentiatingCapabilities = capabilityData?.capabilitys
  .filter(item => (item?.type as any)?.toLowerCase() === "differentiating")
  .map(item => item.capability);

const response = {
  capabilities: differentiatingCapabilities
};

 const apiUrls = `${config.ai_base_url}/differentiation/analyze`;

  const {data} = await axios.post(apiUrls, response, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const difrentData={
...data,
companyName
  }
  console.log(difrentData)
  const capability = await DifferentiatingModel.findOneAndUpdate(
    query,
    difrentData,
    { upsert: true, new: true }
  );
  
 console.log(capability)
  return result;
};

const getAllCapabilitys = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const result = await FoundationModel.findOne(
    { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } },
    { capabilitys: 1, _id: 0 }
  );

  if (!result) {
    throw new AppError(
      status.NOT_FOUND,
      "No capabilitys found for this company!"
    );
  }

  return result.capabilitys;
};

const updateCapabilityById = async (
  companyName: string,
  capabilityId: string,
  payload: { capability?: string; type?: string }
) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const updateData: any = {};
  if (payload.capability !== undefined)
    updateData["capabilitys.$.capability"] = payload.capability;
  if (payload.type !== undefined)
    updateData["capabilitys.$.type"] = payload.type;

  const result = await FoundationModel.findOneAndUpdate(
    {
      companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
      "capabilitys._id": capabilityId,
    },
    { $set: updateData },
    { new: true }
  );

  if (!result)
    throw new AppError(status.NOT_FOUND, "Capability not found to update!");


  const capabilityData = await FoundationModel.findOne(query);

const differentiatingCapabilities = capabilityData?.capabilitys
  .filter(item => (item?.type as any)?.toLowerCase() === "differentiating")
  .map(item => item.capability);

const response = {
  capabilities: differentiatingCapabilities
};

 const apiUrls = `${config.ai_base_url}/differentiation/analyze`;

  const {data} = await axios.post(apiUrls, response, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const difrentData={
...data,
companyName
  }
  const capability = await DifferentiatingModel.findOneAndUpdate(
    query,
    difrentData,
    { upsert: true, new: true }
  );
  
 console.log(capability)

  return result;
};
const deleteCapability = async (companyName: string,id:string) => {
  if (!companyName) throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "Capability ID is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") }
  };

  const update = { $pull: { capabilitys: { _id: id } } };

  const result = await FoundationModel.findOneAndUpdate(query, update, { new: true });
  return result;
};
const createDifrentCapabilitys = async (companyName: string, payload: any) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const result = await FoundationModel.findOneAndUpdate(query, {
    $push: {
      differentiatingCapabilities: payload?.differentiatingCapabilities,
    },
  });

  return result;
};

export const FoundationService = {
  createFoundation,
  getSpecificFoundationByCompanyName,
  updateFoundation,
  deleteFoundation,
  createIdentityIntoDb,
  createZeroInIntoDb,
  createcapabilitys,
  getAllCapabilitys,
  updateCapabilityById,
  createDifrentCapabilitys,
  getAllIdentityFromDb,
  getAllZeroInFromDb,
  deleteCapability
};
