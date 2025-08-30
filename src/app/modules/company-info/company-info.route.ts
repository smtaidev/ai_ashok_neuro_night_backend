import express from 'express'
import { companyInfoContllors } from './company-info.contllors'
import auth from '../../middlewares/auth'
const route=express.Router()
route.post("/create-company-info",auth('companyAdmin'),companyInfoContllors.updateCompanyInfoInDb)
route.get("/get-company-info",auth('companyAdmin'),companyInfoContllors.getCompanyInfoFromDb)




export const companyInfoRote=route