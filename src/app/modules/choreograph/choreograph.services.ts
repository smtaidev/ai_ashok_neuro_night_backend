import status from "http-status";
import AppError from "../../errors/AppError";
import choreographModel from "./choreograph.model";
import { Member, Objective, Team } from "./choreograph.interface";

const createTeamsIntoDb = async (companyName: string, payload: Team) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  // Ensure members is always an array
  const teamPayload = {
    ...payload,
    members: Array.isArray(payload.members) ? payload.members : [],
  };

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  console.log("Payload to save:", teamPayload); // Debug

  console.log(teamPayload);
  const result = await choreographModel.findOneAndUpdate(
    query,
    { $push: { teams: teamPayload } },
    { new: true, upsert: true }
  );
  console.log(teamPayload);

  console.log("Saved result:", result); // Debug

  return result;
};
const getAllTeamsIntoDb = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  // Nested populate: teams.members
  const result = await choreographModel
    .findOne(query)
    .populate({
      path: "teams.members",
      select: "-password", // password exclude korbe
    })
    .select("teams -_id");

  console.log("Teams result:", result);

  return result;
};

const getTeamByCompanyAndId = async (companyName: string, teamId: string) => {
  if (!companyName || !teamId) {
    throw new Error("Company name and team id are required");
  }

  const doc = await choreographModel.findOne(
    {
      companyName: new RegExp(`^${companyName}$`, "i"),
      "teams._id": teamId,
    },
    {
      teams: { $elemMatch: { _id: teamId } },
      _id: 0,
    }
  );

  return doc?.teams?.[0] || null;
};
const getTeamByTeamName = async (companyName: string, teamId: string) => {
  if (!companyName || !teamId) {
    throw new Error("Company name and team id are required");
  }

  const doc = await choreographModel.findOne(
    {
      companyName: new RegExp(`^${companyName}$`, "i"),
      "teams.teamName":new RegExp(`^${teamId}$`, "i"),
    },
    {
      teams: { $elemMatch: { teamName: teamId } },
      _id: 0,
    }
  ).populate({
      path: "teams.members",
      select: "-password", // password exclude korbe
    })

  return doc?.teams?.[0] || null;
};

import mongoose, { Types } from "mongoose";
import { organizationUserModels } from "../organization-role/organization-role.model";
import { BlueprintModel } from "../blueprint/blueprint.model";

const updateTeamInDb = async (
  companyName: string,
  id: string,
  payload: Partial<Team>
) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
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
    "teams._id": teamObjectId,
  };

  const setObj: Record<string, any> = {};
  for (const key in payload) {
    const typedKey = key as keyof typeof payload;
    setObj[`teams.$.${typedKey}`] = payload[typedKey];
  }

  const result = await choreographModel.findOneAndUpdate(
    query,
    { $set: setObj },
    { new: true }
  );
  return result;
};

const deleteTeamInDb = async (companyName: string, teamId: string) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  if (!teamId) throw new AppError(status.BAD_REQUEST, "team id is required!");

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const update = {
    $pull: { teams: { _id: teamId } },
  };

  const result = await choreographModel.findOneAndUpdate(query, update, {
    new: true,
  });

  console.log("Delete operation result:", result);

  if (!result) {
    throw new AppError(404, "No matching company or team found to delete");
  }

  return result;
};

// --------------this is objective section ------------------------------
// ১. Add new Objective
export const addObjective = async (
  companyName: string,
  objectiveData: Partial<Objective>
) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  console.log(objectiveData)
  const result = await choreographModel.findOneAndUpdate(
    { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } },
    { $push: { objectives: objectiveData } },
    { new: true }
  );

  if (!result) throw new Error("Company not found");
  return result;
};

// ২. Get all Objectives
export const getAllObjectives = async (companyName: string) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");

  // 1️⃣ Find the company document
  const doc = await choreographModel.findOne(
    { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } },
    { objectives: 1, _id: 0 }
  );

  if (!doc) throw new Error("Company not found");

  // 2️⃣ Populate each objective individually
  const populatedObjectives = await Promise.all(
    doc.objectives.map(async (obj) => {
      return await choreographModel.populate(obj, [
        { path: "objectiveOwner" },
        { path: "assignedTeamMembers" },
        { path: "invitedTeamMembers"},
        { path: "businessGoals" }
      ]);
    })
  );

  return populatedObjectives;
};


// ৩. Get single Objective by ID
export const getObjectiveById = async (
  companyName: string,
  objectiveId: string
) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  const doc = await choreographModel.findOne(
    {
      companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
      "objectives._id": objectiveId,
    },
    { "objectives.$": 1 }
  );
  if (!doc || !doc.objectives.length) throw new Error("Objective not found");
  return doc.objectives[0];
};

// ৪. Update Objective by ID
export const updateObjective = async (
  companyName: string,
  objectiveId: string,
  updateData: Partial<Objective>
) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  const setObj: Record<string, any> = {};
  for (const key in updateData) {
    setObj[`objectives.$.${key}`] = updateData[key as keyof typeof updateData];
  }

  const result = await choreographModel.findOneAndUpdate(
    {
      companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
      "objectives._id": objectiveId,
    },
    { $set: setObj },
    { new: true }
  );

  if (!result) throw new Error("Objective not found or update failed");
  return result;
};

// ৫. Delete Objective by ID
export const deleteObjective = async (
  companyName: string,
  objectiveId: string
) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is not found!");
  const result = await choreographModel.findOneAndUpdate(
    { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } },
    { $pull: { objectives: { _id: objectiveId } } },
    { new: true }
  );

  if (!result) throw new Error("Objective not found or delete failed");
  return result;
};

// --------------member service ----------------------------------------

// export const createMember = async (
//   companyName: string,
//   teamId: string,
//   memberPayload: Partial<Member>
// ) => {
//   if (!companyName) throw new AppError(status.BAD_REQUEST, "Company name is required");
//   if (!teamId) throw new AppError(status.BAD_REQUEST, "Team ID is required");

//   const query= { companyName: { $regex: new RegExp(`^${companyName}$`, "i") }, "teams._id": teamId }

//   const result = await choreographModel.findOneAndUpdate(

//     {
//       $push: { "teams.$.members": memberPayload }
//     },
//     { new: true }
//   );

//   if (!result) throw new AppError(status.NOT_FOUND, "Team or company not found");

//   return result;
// };

export const createMember = async (
  companyName: string,
  teamId: string,
  memberPayload: any
) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is required");
  if (!teamId) throw new AppError(status.BAD_REQUEST, "Team ID is required");
  if (!memberPayload.memberId)
    throw new AppError(status.BAD_REQUEST, "Member ID is required");

  const memberUpdateData = {
    skills: memberPayload?.skills,
    location: memberPayload.location,
    teamRole: memberPayload.teamRole,
    type: memberPayload.teamRole,
    availability: memberPayload.availability,
  };

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    "teams._id": teamId,
  };

  const result = await choreographModel
    .findOneAndUpdate(
      query,
      {
        $addToSet: { "teams.$.members": memberPayload.memberId }, // Prevent duplicates
      },
      { new: true }
    )
    .populate("teams.members", "-password"); // populate but hide password
  const querys = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    _id: new mongoose.Types.ObjectId(memberPayload?.memberId), // ensure valid format
  };

  const createTeam = await organizationUserModels.findOneAndUpdate(
    querys,
    { $set: memberUpdateData },
    { new: true } // returns updated doc
  );
  if (!result)
    throw new AppError(status.NOT_FOUND, "Team or company not found");

  return result
};

export const getAllMembers = async (companyName: string, teamId: string) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is required");
  if (!teamId) throw new AppError(status.BAD_REQUEST, "Team ID is required");

  const doc = await choreographModel.findOne(
    {
      companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
      "teams._id": teamId,
    },
    { "teams.$": 1 }
  ).populate("teams.members", "-password");

  if (!doc) throw new AppError(status.NOT_FOUND, "Team or company not found");

  return doc.teams[0].members || [];
};

export const getMemberById = async (
  companyName: string,
  teamId: string,
  memberId: string
) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is required");
  if (!teamId) throw new AppError(status.BAD_REQUEST, "Team ID is required");
  if (!memberId)
    throw new AppError(status.BAD_REQUEST, "Member ID is required");

  const doc = await choreographModel
    .findOne({
      companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
      "teams._id": teamId,
      "teams.members": { $in: [new mongoose.Types.ObjectId(memberId)] },
    })
    .populate("teams.members", "-password"); // Populate & hide password

  if (!doc)
    throw new AppError(status.NOT_FOUND, "Member, team or company not found");

  const team = doc.teams.find((t) => t._id.toString() === teamId);
  const member = team?.members.find(
    (m: any) => m._id.toString() === memberId
  );

  if (!member) throw new AppError(status.NOT_FOUND, "Member not found");

  return member;
};


export const updateMemberById = async (
  companyName: string,
  teamId: string,
  memberId: string,
  payload: Partial<{
    name: string;
    teamRole: string;
    skills: string[];
    location: string;
    type: string;
    availability: string;
  }>
) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is required");
  if (!teamId) throw new AppError(status.BAD_REQUEST, "Team ID is required");
  if (!memberId)
    throw new AppError(status.BAD_REQUEST, "Member ID is required");

  // Update main choreographModel team member reference if needed
  const result = await choreographModel.findOneAndUpdate(
    {
      companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
      "teams._id": teamId,
      "teams.members": { $in: [memberId] },
    },
    { $set: {} }, // No change in reference array
    { new: true }
  );

  if (!result) {
    throw new AppError(
      status.NOT_FOUND,
      "Member not found in this team or company"
    );
  }

  // Update member details in organizationUserModels
  const updateMember = await organizationUserModels.findOneAndUpdate(
    {
      companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
      _id: new mongoose.Types.ObjectId(memberId),
    },
    { $set: payload },
    { new: true }
  );

  if (!updateMember)
    throw new AppError(status.NOT_FOUND, "Member profile not found");

  return updateMember;
};

export const deleteMemberById = async (
  companyName: string,
  teamId: string,
  memberId: string
) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is required");
  if (!teamId) throw new AppError(status.BAD_REQUEST, "Team ID is required");
  if (!memberId)
    throw new AppError(status.BAD_REQUEST, "Member ID is required");

  const result = await choreographModel.findOneAndUpdate(
    {
      companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
      "teams._id": new mongoose.Types.ObjectId(teamId),
    },
    { $pull: { "teams.$.members": memberId } }, // সরাসরি memberId
    { new: true }
  );

  if (!result)
    throw new AppError(status.NOT_FOUND, "Member, team or company not found");

  return result;
};


const objectivesOverview = async (companyName: string) => {
  if (!companyName)
    throw new AppError(status.BAD_REQUEST, "Company name is required!");

  const blueprint = await BlueprintModel.findOne(
    { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } },
    { strategicThemes: 1, businessGoals: 1, _id: 0 }
  );

  if (!blueprint) return [];

  // Choreograph theke objectives niye asho
  const choreograph = await choreographModel.findOne(
    { companyName: { $regex: new RegExp(`^${companyName}$`, "i") } },
    { objectives: 1, _id: 0 }
  );

  // console.log('this is blueprint data', blueprint)

  const strategicThemesWithGoals = blueprint.strategicThemes.map(theme => {
    const goals = blueprint.businessGoals
      .filter(bg => bg?.strategicID?.toString() === theme._id.toString())
      .map(bg => {
        // Prottekta business goal er relevant objectives Choreograph theke filter koro
        const relevantObjectives = choreograph?.objectives?.filter(
          obj => obj.businessGoals?.toString() === bg._id.toString()
        );
        return { ...bg.toObject(), objectives: relevantObjectives };
      });

    
    return { ...theme.toObject(), businessGoals: goals };
  });

    
  return strategicThemesWithGoals;
};
export const choreographServices = {
  createTeamsIntoDb,
  updateTeamInDb,
  getAllTeamsIntoDb,
  getTeamByCompanyAndId,
  deleteTeamInDb,
  addObjective,
  getAllObjectives,
  getObjectiveById,
  updateObjective,
  deleteObjective,
  createMember,
  getAllMembers,
  updateMemberById,
  getMemberById,
  deleteMemberById,
  getTeamByTeamName,
  objectivesOverview
};
