
import express from 'express'
import { companyContllors } from './company.contllors'

const  route =express.Router()
route.post("/send-email",companyContllors.sendEmailForSuperAdmins)

export const companyRoute=route
