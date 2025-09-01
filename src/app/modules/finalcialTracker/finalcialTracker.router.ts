import express from 'express'
import { finalcialTrackerContllors } from './finalcialTracker.contllors'
import auth from '../../middlewares/auth'

const router=express.Router()
router.post('/',auth("companyAdmin","superAdmin"),finalcialTrackerContllors.createfinalcialTrackerIntDb)
router.get('/',auth("companyAdmin","superAdmin","companyEmployee"),finalcialTrackerContllors.getfinalcialTrackerIntDb)
router.patch('/:id',auth("companyAdmin","superAdmin","companyEmployee"),finalcialTrackerContllors.updatedfinalcialTrackerIntDb)
router.delete('/:id',auth("companyAdmin","superAdmin"),finalcialTrackerContllors.updatedfinalcialTrackerIntDb)


export  const finalcialTrackerRouter=router