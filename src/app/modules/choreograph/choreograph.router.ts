
import express from 'express'
import auth from '../../middlewares/auth'
import { choregoraphContllors } from './choreograph.contllors'

const route=express.Router()

//-------------teams route ---------------------
route.patch("/",auth("companyAdmin"),choregoraphContllors.createChoregoraphDb)
route.get("/",auth("companyAdmin"),choregoraphContllors.getAllChoregoraphDb)
route.get("/:id",auth("companyAdmin"),choregoraphContllors.getSingeleChoregoraphDb)
route.get("/:id/get-single-team",auth("companyAdmin"),choregoraphContllors.getSingeleTeamDb)
route.patch("/update-teams/:id",auth("companyAdmin"),choregoraphContllors.updateChoregoraphDb)
route.delete("/:id",auth("companyAdmin"),choregoraphContllors.deleteChoregorapTeamhDb)

// ---------------- Objective route  -------------------------

route.patch("/objective",auth("companyAdmin"),choregoraphContllors.addObjectiveController)
route.get("/objective/get-all",auth("companyAdmin"),choregoraphContllors.getAllObjectivesController)
route.get("/objective/:id",auth("companyAdmin"),choregoraphContllors.getObjectiveByIdController)
route.patch("/objective/update-objective/:id",auth("companyAdmin"),choregoraphContllors.updateObjectiveController)
route.delete("/objective/:id",auth("companyAdmin"),choregoraphContllors.deleteObjectiveController)

// ----------------------------- member route---------------------------------------

route.patch("/:teamId/members",auth("companyAdmin"), choregoraphContllors.addMemberController);
route.get("/:teamId/members", auth("companyAdmin"),choregoraphContllors.getAllMembersController);
route.get("/:teamId/members/:memberId",auth("companyAdmin"),choregoraphContllors.getMemberByIdController);
route.patch("/:teamId/members/:memberId", auth("companyAdmin"),choregoraphContllors.updateMemberController);
route.delete("/:teamId/members/:memberId", auth("companyAdmin"),choregoraphContllors.deleteMemberController);
export const choregorapRoute=route