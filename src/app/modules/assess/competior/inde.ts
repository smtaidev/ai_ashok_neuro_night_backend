
import express from 'express'
import { AssessContllors } from '../assess.contllors'
import auth from '../../../middlewares/auth'


const router=express.Router()

//-------------competior route arey ---------------------------------------
router.patch('/',auth('companyAdmin'),AssessContllors.createCompetitorAnalysisIntDb)


export const assessCompetiorRouter=router