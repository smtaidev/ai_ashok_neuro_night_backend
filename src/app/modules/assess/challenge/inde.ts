
import express from 'express'
import auth from '../../../middlewares/auth'
import { AssessContllors } from '../assess.contllors'


const router=express.Router()
//-------------trend route arey ---------------------------------------


//-------------challenge route arey ---------------------------------------
router.patch('/create-challenge',auth('companyAdmin'),AssessContllors.createChallengeIntDb)
router.get('/get-challenge',auth('companyAdmin'),AssessContllors.getAllChallengesFromDb)
router.get('/:id/get-challenge',auth('companyAdmin'),AssessContllors.getSingleChallengeFromDb)
router.patch('/:id/update-challenge',auth('companyAdmin'),AssessContllors.updatChallengeIntDb)
router.delete('/delete-challenge/:id',auth('companyAdmin'),AssessContllors.deleteSingleChallengeFromDb)


export const assessChallengeRouter=router