
import express from 'express'
import auth from '../../../middlewares/auth'
import { AssessContllors } from '../assess.contllors'


const router=express.Router()

//-------------swot route arey ---------------------------------------
router.patch('/create',auth('companyAdmin'),AssessContllors.createsingleSwotIntDb)
router.get('/get-swot',auth('companyAdmin',"companyEmployee"),AssessContllors.getsingleSwotIntDb)
// router.patch('/',auth('companyAdmin'),AssessContllors.createSwotIntDb)
router.patch('/:id',auth('companyAdmin',"companyEmployee"),AssessContllors.updateSwotIntDb)
router.delete('/:id',auth('companyAdmin',"companyEmployee"),AssessContllors.deletesingleSwotIntDb)



export const assessSwotRouter=router