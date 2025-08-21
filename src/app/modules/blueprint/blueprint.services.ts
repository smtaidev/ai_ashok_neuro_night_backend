import status from "http-status";
import AppError from "../../errors/AppError";
import { Blueprint, BusinessGoal, StrategicTheme } from "./blueprint.interface";
import { BlueprintModel } from "./blueprint.model";
import config from "../../../config";
import axios from "axios";

const createVision = async (companyName: string, payload: Partial<Blueprint>) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  if (!payload.vision) {
    throw new AppError(status.BAD_REQUEST, "Vision is required!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };



  const result = await BlueprintModel.findOneAndUpdate(
    query,
    { $set: { vision: payload.vision } },
    { new: true, upsert: true } 
  );




  return result;
};

const getVision=async(companyName: string)=>{
    if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }



  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const result=await BlueprintModel.findOne(query,{vision:1})

  return result
}

const createstategicTheme = async (companyName: string, payload: Partial<BusinessGoal>) => {
  
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const result = await BlueprintModel.findOneAndUpdate(
    query,
    { $push: { strategicThemes:payload } },
    { new: true, upsert: true } 
  );

  

  return result;
};
const updatestategicTheme = async (id:string,companyName: string, payload: Partial<StrategicTheme>) => {
    console.log(payload)
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  
const query = {
  companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  "strategicThemes._id": id
};

const update = {
  $set: {
    "strategicThemes.$.name": payload.name,
    "strategicThemes.$.description": payload.description,
  }
};

const result = await BlueprintModel.findOneAndUpdate(query, update, { new: true });


  return result;
};


const getAllStrategicThemes = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") }
  };

  const result = await BlueprintModel.findOne(query, { strategicThemes: 1, _id: 0 });
  return result?.strategicThemes || [];
};

const getSingleStrategicTheme = async (id: string, companyName: string) => {
  if (!companyName) throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "Theme ID is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "strategicThemes._id": id
  };

  const result = await BlueprintModel.findOne(query, { "strategicThemes.$": 1, _id: 0 });
  return result?.strategicThemes?.[0] || null;
};

const deleteSingleStrategicTheme = async (id: string, companyName: string) => {
  if (!companyName) throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "Theme ID is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const update = {
    $pull: {
      strategicThemes: { _id: id }
    }
  };

  const result = await BlueprintModel.updateOne(query, update);

  if (result.modifiedCount === 0) {
    throw new AppError(status.NOT_FOUND, "Strategic theme not found or already deleted!");
  }

  return { success: true, message: "Strategic theme deleted successfully." };
};

// ------------------this is the business goal services -------------------------------------areya 
const createbusinessGoal = async (companyName: string, payload: Partial<BusinessGoal>) => {

   
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };


  console.log(payload)
try {
  const result = await BlueprintModel.findOneAndUpdate(
    query,
    { $push: { businessGoals: payload } },
    { new: true, upsert: true }
  );
  console.log("Update result:", result);
  return result;
} catch (error) {
  console.error("Error while adding businessGoal:", error);
  throw error;
}

};
const updateBusinessGoal = async (
  id: string,
  companyName: string,
  payload: Partial<BusinessGoal> 
) => {
  if (!companyName) throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!payload || Object.keys(payload).length === 0) throw new AppError(status.BAD_REQUEST, "Payload is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "businessGoals._id": id
  };

  const setObj: Record<string, any> = {};
  for (const key in payload) {
    const typedKey = key as keyof typeof payload;
    setObj[`businessGoals.$.${typedKey}`] = payload[typedKey];
  }

  const update = { $set: setObj };

  const result = await BlueprintModel.findOneAndUpdate(query, update, { new: true });
  return result;
};

const getAllBusinessGoals = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") }
  };

  const result = await BlueprintModel.findOne(query, { businessGoals: 1, _id: 0 });
  return result?.businessGoals || [];
};

const getSingleBusinessGoal = async (id: string, companyName: string) => {
  if (!companyName) throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "Goal ID is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "businessGoals._id": id
  };

  const result = await BlueprintModel.findOne(query, { "businessGoals.$": 1, _id: 0 });
  return result?.businessGoals?.[0] || null;
};

const deleteBusinessGoal = async (id: string, companyName: string) => {
  if (!companyName) throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "Goal ID is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") }
  };

  const update = { $pull: { businessGoals: { _id: id } } };

  const result = await BlueprintModel.findOneAndUpdate(query, update, { new: true });
  return result;
};

const businessGoalOverview = async (companyName: string) => {
  if (!companyName) throw new AppError(status.BAD_REQUEST, "Company name is required!");

  const blueprint = await BlueprintModel.findOne(
    { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } },
    { strategicThemes: 1, businessGoals: 1, _id: 0 } // sob business goals niye aso
  );

  if (!blueprint) return [];

  // Prottekta strategic theme er niche tar relevant business goals filter koro
  const strategicThemesWithGoals = blueprint.strategicThemes.map(theme => {
    const goals = blueprint.businessGoals.filter(bg => bg.strategicID.toString() === theme._id.toString());
    return {
      ...theme.toObject(),
      businessGoals: goals
    };
  });

  return strategicThemesWithGoals;
};
export const blueprintServices = {
  createVision,
  createstategicTheme,
  updatestategicTheme
  ,
  createbusinessGoal,
  updateBusinessGoal,
  getAllBusinessGoals,
  getSingleBusinessGoal,
  deleteBusinessGoal,
  getVision,
  getAllStrategicThemes,
  getSingleStrategicTheme,
  deleteSingleStrategicTheme
  ,businessGoalOverview
};
