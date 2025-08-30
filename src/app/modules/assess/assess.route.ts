
import express from 'express'
import { AssessContllors } from './assess.contllors'
import auth from '../../middlewares/auth'

const router=express.Router()
//-------------trend route arey ---------------------------------------

router.patch('/create-trend',auth('companyAdmin',"companyEmployee"),AssessContllors.createTrendIntDb)
router.patch('/update-trend/:id',auth('companyAdmin',"companyEmployee"),AssessContllors.updateTrendIntDb)
router.get('/trend', auth('companyAdmin',"companyEmployee"), AssessContllors.getAllTrendsIntDb);

//----assess all route arey  handile super admin---------------------------------------
router.post('/',auth("companyAdmin","superAdmin"),AssessContllors.createAssessIntDb)
router.get('/',auth("companyAdmin","superAdmin"),AssessContllors.getAssessIntDb)
router.get('/:id',auth("companyAdmin","superAdmin"),AssessContllors.getSingleAssessIntDb)
router.patch('/:id',auth("companyAdmin","superAdmin"),AssessContllors.updatedAssessIntDb
)
router.delete('/:id',auth("companyAdmin","superAdmin"),AssessContllors.deletedAssessIntDb
)

export const assessRouter=router