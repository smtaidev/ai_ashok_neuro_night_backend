
import express from 'express'
import auth from '../../middlewares/auth'
import { planContllors } from './plan.contllors'
const route =express.Router()
 route.post('/',auth('superAdmin'),planContllors.planCreate)
 route.get('/',auth('superAdmin'),planContllors.getAllPlans)
 route.get('/:id',auth('superAdmin'),planContllors.getSinglePlan)
 route.patch('/:id',auth('superAdmin'),planContllors.updatePlan)
 route.delete('/:id',auth('superAdmin'),planContllors.deletePlan)


 export const PlanRouters=route