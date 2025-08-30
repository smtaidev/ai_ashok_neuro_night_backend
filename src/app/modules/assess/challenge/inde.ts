
import express from 'express'
import auth from '../../../middlewares/auth'
import { AssessContllors } from '../assess.contllors'


const router=express.Router()
//-------------trend route arey ---------------------------------------


//-------------challenge route arey ---------------------------------------
router.patch('/create-challenge',auth('companyAdmin',"companyEmployee"),AssessContllors.createChallengeIntDb)
router.get('/get-challenge',auth('companyAdmin',"companyEmployee"),AssessContllors.getAllChallengesFromDb)
router.get('/:id/get-challenge',auth('companyAdmin',"companyEmployee"),AssessContllors.getSingleChallengeFromDb)
router.patch('/:id/update-ai-challenge',auth('companyAdmin',"companyEmployee"),AssessContllors.UpdateSingleChallengeAiDataFromDb)
router.patch('/:id/update-challenge',auth('companyAdmin',"companyEmployee"),AssessContllors.updatChallengeIntDb)
router.delete('/delete-challenge/:id',auth('companyAdmin'),AssessContllors.deleteSingleChallengeFromDb)


export const assessChallengeRouter=router