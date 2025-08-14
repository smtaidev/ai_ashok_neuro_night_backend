import express from'express'
import auth from '../../middlewares/auth'
import { blueprintContllors } from './blueprint.contllors'
const route=express.Router()

route.patch('/create-vison',auth('companyAdmin'),blueprintContllors.createVisonDb)
route.patch('/stategic-theme',auth('companyAdmin'),blueprintContllors.creatstategicThemeDb)
route.patch('/stategic-theme/:id',auth('companyAdmin'),blueprintContllors.updatetstategicThemeDb)

//-------------this is business goal route arey -----------------------------
route.patch('/business-goals/create',auth('companyAdmin'),blueprintContllors.createbusinessGoalDb)
route.get('/get-business-goals',auth('companyAdmin'),blueprintContllors.getAllBusinessGoalsDb)
route.get('/:id/get-business-goals',auth('companyAdmin'),blueprintContllors.getSingleBusinessGoalDb)
route.patch('/:id/get-business-goals',auth('companyAdmin'),blueprintContllors.updatebusinessGoalDb)
route.delete('/:id/get-business-goals',auth('companyAdmin'),blueprintContllors.deleteBusinessGoalDb)
export const blueprintRouter=route