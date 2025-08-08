
import express from 'express'
import { AssessContllors } from './assess.contllors'
import auth from '../../middlewares/auth'

const router=express.Router()
router.patch('/create-trend',auth('companyAdmin','superAdmin'),AssessContllors.createTrendIntDb)
router.post('/',auth("companyAdmin","superAdmin"),AssessContllors.createAssessIntDb)
router.get('/',auth("companyAdmin","superAdmin"),AssessContllors.getAssessIntDb)
router.get('/:id',auth("companyAdmin","superAdmin"),AssessContllors.getSingleAssessIntDb)
router.patch('/:id',auth("companyAdmin","superAdmin"),AssessContllors.updatedAssessIntDb
)
router.delete('/:id',auth("companyAdmin","superAdmin"),AssessContllors.deletedAssessIntDb
)
//-------------trend route arey ---------------------------------------

export const assessRouter=router