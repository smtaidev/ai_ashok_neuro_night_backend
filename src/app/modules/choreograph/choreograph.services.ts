import status from "http-status";
import AppError from "../../errors/AppError";
import choreographModel from "./choreograph.model";
import { Team } from "./choreograph.interface";


const createTeamsIntoDb = async (companyName: string, payload: Team) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  console.log("Payload to save:", payload);  // Debug

  const result = await choreographModel.findOneAndUpdate(
    query,
    { $push: { teams: payload } },
    { new: true, upsert: true }
  );

  console.log("Saved  result:", result);  // Debug

  return result;
};
const getAllTeamsIntoDb = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };


  const result = await choreographModel.findOne(
    query
  );

  console.log("Saved  result:", result);  // Debug

  return result;
};

const getTeamByCompanyAndId = async (companyName: string, teamId: string) => {
  if (!companyName || !teamId) {
    throw new Error("Company name and team id are required");
  }

  const doc = await choreographModel.findOne(
    {
      companyName: new RegExp(`^${companyName}$`, "i"),
      "teams._id": teamId
    },
    {
      teams: { $elemMatch: { _id: teamId } },
      _id: 0,
    }
  );

  return doc?.teams?.[0] || null;
};



import mongoose from "mongoose";

const updateTeamInDb = async (companyName: string, id: string, payload: Partial<Team>) => {
  if (!companyName) throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!id) throw new AppError(status.BAD_REQUEST, "team id is required!");

  // id কে ObjectId তে কনভার্ট করা
  let teamObjectId;
  try {
    teamObjectId = new mongoose.Types.ObjectId(id);
  } catch (error) {
    throw new AppError(status.BAD_REQUEST, "Invalid team id format!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "teams._id": teamObjectId
  };

  const setObj: Record<string, any> = {};
  for (const key in payload) {
    const typedKey = key as keyof typeof payload;
    setObj[`teams.$.${typedKey}`] = payload[typedKey];
  }

  const result = await choreographModel.findOneAndUpdate(query, { $set: setObj }, { new: true });
  return result;
};




const deleteTeamInDb = async (companyName: string, teamId: string) => {
  if (!companyName) throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!teamId) throw new AppError(status.BAD_REQUEST, "team id is required!");



  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") }
  };

  const update = {
    $pull: { teams: { _id: teamId } }
  };

  const result = await choreographModel.findOneAndUpdate(query, update, { new: true });

  console.log("Delete operation result:", result);

  if (!result) {
    throw new AppError(404, "No matching company or team found to delete");
  }

  return result;
};


export const  choreographServices={
createTeamsIntoDb,
updateTeamInDb,
getAllTeamsIntoDb,
getTeamByCompanyAndId,
deleteTeamInDb
}