import express from'express'
import auth from '../../middlewares/auth'
import { blueprintContllors } from './blueprint.contllors'
const route=express.Router()

route.patch('/create-vison',auth('companyAdmin'),blueprintContllors.createVisonDb)
route.get('/get-vision',auth('companyAdmin'),blueprintContllors.getVisonDb)
route.patch('/stategic-theme',auth('companyAdmin'),blueprintContllors.creatstategicThemeDb)
route.get('/stategic-theme',auth('companyAdmin'),blueprintContllors.getAllstategicThemeDb)
route.patch('/stategic-theme/:id',auth('companyAdmin'),blueprintContllors.updatetstategicThemeDb)
route.get('/stategic-theme/:id',auth('companyAdmin'),blueprintContllors.getSinglestategicThemeDb)
route.delete('/stategic-theme/:id',auth('companyAdmin'),blueprintContllors.deleteSingleStrategicThemeDb)

//-------------this is business goal route arey -----------------------------
route.patch('/business-goals/create',auth('companyAdmin'),blueprintContllors.createbusinessGoalDb)
route.get('/get-business-goals',auth('companyAdmin'),blueprintContllors.getAllBusinessGoalsDb)
route.get('/:id/get-business-goals',auth('companyAdmin'),blueprintContllors.getSingleBusinessGoalDb)
route.patch('/:id/get-business-goals',auth('companyAdmin'),blueprintContllors.updatebusinessGoalDb)
route.delete('/:id/get-business-goals',auth('companyAdmin'),blueprintContllors.deleteBusinessGoalDb)
route.get('/business-goal-overview',auth('companyAdmin'),blueprintContllors.businessGoalOverview)
export const blueprintRouter=route