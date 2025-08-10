
import express from 'express'
import auth from '../../../middlewares/auth'
import { AssessContllors } from '../assess.contllors'


const router=express.Router()
//-------------trend route arey ---------------------------------------


//-------------challenge route arey ---------------------------------------
router.patch('/',auth('companyAdmin'),AssessContllors.createChallengeIntDb)
router.patch('/:id',auth('companyAdmin'),AssessContllors.updatChallengeIntDb)


export const assessChallengeRouter=router