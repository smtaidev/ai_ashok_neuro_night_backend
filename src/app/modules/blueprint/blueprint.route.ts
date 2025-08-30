import express from'express'
import auth from '../../middlewares/auth'
import { blueprintContllors } from './blueprint.contllors'
const route=express.Router()

route.patch('/create-vison',auth('companyAdmin',"companyEmployee"),blueprintContllors.createVisonDb)
route.get('/get-vision',auth('companyAdmin',"companyEmployee"),blueprintContllors.getVisonDb)
route.patch('/stategic-theme',auth('companyAdmin'),blueprintContllors.creatstategicThemeDb)
route.get('/stategic-theme',auth('companyAdmin',"companyEmployee"),blueprintContllors.getAllstategicThemeDb)
route.patch('/stategic-theme/:id',auth('companyAdmin',"companyEmployee"),blueprintContllors.updatetstategicThemeDb)
route.get('/stategic-theme/:id',auth('companyAdmin',"companyEmployee"),blueprintContllors.getSinglestategicThemeDb)
route.delete('/stategic-theme/:id',auth('companyAdmin',"companyEmployee"),blueprintContllors.deleteSingleStrategicThemeDb)

//-------------this is business goal route arey -----------------------------
route.patch('/business-goals/create',auth('companyAdmin'),blueprintContllors.createbusinessGoalDb)
route.get('/get-business-goals',auth('companyAdmin',"companyEmployee"),blueprintContllors.getAllBusinessGoalsDb)
route.get('/:id/get-business-goals',auth('companyAdmin',"companyEmployee"),blueprintContllors.getSingleBusinessGoalDb)
route.patch('/:id/get-business-goals',auth('companyAdmin',"companyEmployee"),blueprintContllors.updatebusinessGoalDb)
route.delete('/:id/get-business-goals',auth('companyAdmin'),blueprintContllors.deleteBusinessGoalDb)
route.get('/business-goal-overview',auth('companyAdmin',"companyEmployee"),blueprintContllors.businessGoalOverview)
export const blueprintRouter=route
