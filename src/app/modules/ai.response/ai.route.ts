
import express from 'express'
import { aiRespnonseContllors } from './ai.contllors'
import auth from '../../middlewares/auth'

const route=express.Router()
route.get("/get-trend",auth("companyAdmin","companyEmployee"),aiRespnonseContllors.getTrendAirecommendations)
route.get("/get-swot",auth("companyAdmin","companyEmployee"),aiRespnonseContllors.getSwotirecommendations)
route.get("/get-challenge",auth("companyAdmin","companyEmployee"),aiRespnonseContllors.challengerecommendations)
route.get("/challenge-rixScore",auth("companyAdmin","companyEmployee"),aiRespnonseContllors.challengeRixScore)
route.post("/create-themes",auth("companyAdmin","companyEmployee"),aiRespnonseContllors.createThemesAi)
route.post("/create-business-goal",auth("companyAdmin","companyEmployee"),aiRespnonseContllors.createBusinessGoalAi)
route.get("/create-vision",auth("companyAdmin","companyEmployee"),aiRespnonseContllors.createVision)
route.post('/create-swot',auth('companyAdmin',"companyEmployee"),aiRespnonseContllors.createSwotAiData)

export const aiRespnonseRoute=route