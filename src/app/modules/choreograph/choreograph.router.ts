
import express from 'express'
import auth from '../../middlewares/auth'
import { choregoraphContllors } from './choreograph.contllors'

const route=express.Router()
route.patch("/",auth("companyAdmin"),choregoraphContllors.createChoregoraphDb)
route.get("/",auth("companyAdmin"),choregoraphContllors.getAllChoregoraphDb)
route.get("/:id",auth("companyAdmin"),choregoraphContllors.getSingeleChoregoraphDb)
route.patch("/update-teams/:id",auth("companyAdmin"),choregoraphContllors.updateChoregoraphDb)
route.delete("/:id",auth("companyAdmin"),choregoraphContllors.deleteChoregorapTeamhDb)


export const choregorapRoute=route