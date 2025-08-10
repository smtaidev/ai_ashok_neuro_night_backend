import express from'express'
import auth from '../../middlewares/auth'
import { blueprintContllors } from './blueprint.contllors'
const route=express.Router()

route.patch('/create-vison',auth('companyAdmin'),blueprintContllors.createVisonDb)
route.patch('/stategic-theme',auth('companyAdmin'),blueprintContllors.creatstategicThemeDb)
route.patch('/stategic-theme/:id',auth('companyAdmin'),blueprintContllors.updatetstategicThemeDb)
route.patch('/business-goals',auth('companyAdmin'),blueprintContllors.createbusinessGoalDb)
route.patch('/business-goals/:id',auth('companyAdmin'),blueprintContllors.updatebusinessGoalDb)

export const blueprintRouter=route