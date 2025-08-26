
import express from 'express'
import auth from '../../middlewares/auth'
import { alignmentCheckContllors } from './alignmentCheck.contllors'

const route=express.Router()
route.post("/",auth("companyAdmin","companyEmployee"),alignmentCheckContllors.createalignmentCheckIntDb)
route.get("/",auth("companyAdmin"),alignmentCheckContllors.getalignmentCheckIntDb)
route.get("/my-alignment",auth("companyAdmin"),alignmentCheckContllors.getMyAlignmentCheckIntDb)

export const alignmentCheckRoute=route