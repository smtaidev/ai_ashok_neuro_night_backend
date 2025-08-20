
import express from 'express'
import { AssessContllors } from '../assess.contllors'
import auth from '../../../middlewares/auth'


const router=express.Router()

//-------------competior route arey ---------------------------------------
router.get('/',auth('companyAdmin'),AssessContllors.createCompetitorAnalysisIntDb)
router.patch('/:id',auth('companyAdmin'),AssessContllors.updatCompetitorAnalysisIntDb)
router.patch('/:id',auth('companyAdmin'),AssessContllors.updatCompetitorAnalysisIntDb)


export const assessCompetiorRouter=router