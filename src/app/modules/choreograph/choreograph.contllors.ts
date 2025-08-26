import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { choreographServices } from "./choreograph.services";

const createChoregoraphDb = catchAsync(async (req, res) => {
  const company = req.user;
  console.log("check company data", company);
  const result = await choreographServices.createTeamsIntoDb(
    company.companyName,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "choregoraph successfully created !",
    data: result,
  });
});
const getAllChoregoraphDb = catchAsync(async (req, res) => {
  const company = req.user;
  console.log("check company data", company);
  const result = await choreographServices.getAllTeamsIntoDb(
    company.companyName
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "all choregoraph successfully get!",
    data: result,
  });
});
const getSingeleChoregoraphDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  console.log("check company data", company);
  const result = await choreographServices.getTeamByCompanyAndId(
    company.companyName,
    id
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: " choregoraph singe team successfully get!",
    data: result,
  });
});
const getSingeleTeamDb = catchAsync(async (req, res) => {
  const company = req.user;
  const {id} = req.params;
  console.log("check company data", company);
  const result = await choreographServices.getTeamByTeamName(
    company.companyName,
    id
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: " single team successfully get!",
    data: result,
  });
});
const updateChoregoraphDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  const result = await choreographServices.updateTeamInDb(
    company.companyName,
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "choregoraph team successfully updated !",
    data: result,
  });
});
const deleteChoregorapTeamhDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  console.log(id);
  const result = await choreographServices.deleteTeamInDb(
    company.companyName,
    id
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "delete successfully !",
    data: null,
  });
});

// -----------------------------objective section------------------------

const addObjectiveController = catchAsync(async (req, res) => {
  const company = req.user;
  const objectiveData = req.body;

  const result = await choreographServices.addObjective(
    company.companyName,
    objectiveData
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Objective added successfully!",
    data: result,
  });
});

const getAllObjectivesController = catchAsync(async (req, res) => {
  const company = req.user;

  const result = await choreographServices.getAllObjectives(
    company.companyName
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All objectives fetched successfully!",
    data: result,
  });
});

const getObjectiveByIdController = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;

  const result = await choreographServices.getObjectiveById(
    company.companyName,
    id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Objective fetched successfully!",
    data: result,
  });
});

const updateObjectiveController = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  const updateData = req.body;

  const result = await choreographServices.updateObjective(
    company.companyName,
    id,
    updateData
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Objective updated successfully!",
    data: result,
  });
});

const deleteObjectiveController = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;

  await choreographServices.deleteObjective(company.companyName, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Objective deleted successfully!",
    data: null,
  });
});



// -------------------------- member contllors  section -----------------------------------------------

const addMemberController = catchAsync(async (req, res) => {
  const company = req.user;
  const { teamId } = req.params;
  const memberData = req.body;
console.log(company)

  console.log(memberData)
  const result = await choreographServices.createMember(
    company.companyName,
    teamId,
    memberData
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Member added successfully!",
    data: result,
  });
});

const getAllMembersController = catchAsync(async (req, res) => {
  const company = req.user;
  const { teamId } = req.params;

  const result = await choreographServices.getAllMembers(
    company.companyName,
    teamId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All members fetched successfully!",
    data: result,
  });
});

const getMemberByIdController = catchAsync(async (req, res) => {
  const company = req.user;
  const { teamId, memberId } = req.params;

  const result = await choreographServices.getMemberById(
    company.companyName,
    teamId,
    memberId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Member fetched successfully!",
    data: result,
  });
});

const updateMemberController = catchAsync(async (req, res) => {
  const company = req.user;
  const { teamId, memberId } = req.params;
  const updateData = req.body;

  const result = await choreographServices.updateMemberById(
    company.companyName,
    teamId,
    memberId,
    updateData
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Member updated successfully!",
    data: result,
  });
});

const deleteMemberController = catchAsync(async (req, res) => {
  const company = req.user;
  const { teamId, memberId } = req.params;

  await choreographServices.deleteMemberById(
    company.companyName,
    teamId,
    memberId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Member deleted successfully!",
    data: null,
  });
});

export const choregoraphContllors = {
  createChoregoraphDb,
  updateChoregoraphDb,
  getAllChoregoraphDb,
  getSingeleChoregoraphDb,
  deleteChoregorapTeamhDb,
  addObjectiveController,
  getAllObjectivesController,
  getObjectiveByIdController,
  updateObjectiveController,
  deleteObjectiveController,
  addMemberController,
  getAllMembersController,
  getMemberByIdController,
  updateMemberController,
  deleteMemberController,
  getSingeleTeamDb
};
