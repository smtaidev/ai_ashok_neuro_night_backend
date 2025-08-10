
import express from 'express'
import auth from '../../../middlewares/auth'
import { AssessContllors } from '../assess.contllors'


const router=express.Router()

//-------------swot route arey ---------------------------------------
router.patch('/',auth('companyAdmin'),AssessContllors.createSwotIntDb)
router.patch('/:id',auth('companyAdmin'),AssessContllors.updateSwotIntDb)


export const assessSwotRouter=router