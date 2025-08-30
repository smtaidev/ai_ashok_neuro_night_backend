
import express from 'express'
import auth from '../../middlewares/auth'
import { choregoraphContllors } from './choreograph.contllors'

const route=express.Router()

//-------------teams route ---------------------
route.patch("/",auth("companyAdmin"),choregoraphContllors.createChoregoraphDb)
route.get("/",auth("companyAdmin","companyEmployee"),choregoraphContllors.getAllChoregoraphDb)
route.get("/:id",auth("companyAdmin","companyEmployee"),choregoraphContllors.getSingeleChoregoraphDb)
route.get("/:id/get-single-team",auth("companyAdmin","companyEmployee"),choregoraphContllors.getSingeleTeamDb)
route.patch("/update-teams/:id",auth("companyAdmin"),choregoraphContllors.updateChoregoraphDb)
route.delete("/:id",auth("companyAdmin"),choregoraphContllors.deleteChoregorapTeamhDb)

// ---------------- Objective route  -------------------------

route.patch("/objective",auth("companyAdmin"),choregoraphContllors.addObjectiveController)
route.get("/objective/get-all",auth("companyAdmin","companyEmployee"),choregoraphContllors.getAllObjectivesController)
route.get("/objective/get-overviews",auth("companyAdmin","companyEmployee"),choregoraphContllors.objectivesOverview)
route.get("/objective/:id",auth("companyAdmin","companyEmployee"),choregoraphContllors.getObjectiveByIdController)
route.patch("/objective/update-objective/:id",auth("companyAdmin","companyEmployee"),choregoraphContllors.updateObjectiveController)
route.delete("/objective/:id",auth("companyAdmin"),choregoraphContllors.deleteObjectiveController)

// ----------------------------- member route---------------------------------------

route.patch("/:teamId/members",auth("companyAdmin","companyEmployee"), choregoraphContllors.addMemberController);
route.get("/:teamId/members", auth("companyAdmin","companyEmployee"),choregoraphContllors.getAllMembersController);
route.get("/:teamId/members/:memberId",auth("companyAdmin","companyEmployee"),choregoraphContllors.getMemberByIdController);
route.patch("/:teamId/members/:memberId", auth("companyAdmin","companyEmployee"),choregoraphContllors.updateMemberController);
route.delete("/:teamId/members/:memberId", auth("companyAdmin"),choregoraphContllors.deleteMemberController);
export const choregorapRoute=route