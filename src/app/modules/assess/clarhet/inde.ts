
import express from 'express'
import { AssessContllors } from '../assess.contllors'
import auth from '../../../middlewares/auth'


const router=express.Router()
//-------------trend route arey ---------------------------------------

//-------------ClarhetRecommendation route arey ---------------------------------------
router.patch('/',auth('companyAdmin'),AssessContllors.createClarhetRecommendationIntDb)


export const assessClarhetRouter=router