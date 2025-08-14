
import express from 'express'
import { aiRespnonseContllors } from './ai.contllors'
import auth from '../../middlewares/auth'

const route=express.Router()
route.get("/get-trend",auth("companyAdmin"),aiRespnonseContllors.getTrendAirecommendations)
route.get("/get-swot",auth("companyAdmin"),aiRespnonseContllors.getSwotirecommendations)
route.get("/get-challenge",auth("companyAdmin"),aiRespnonseContllors.challengerecommendations)
route.get("/challenge-rixScore",auth("companyAdmin"),aiRespnonseContllors.challengeRixScore)
route.post("/create-themes",auth("companyAdmin"),aiRespnonseContllors.createThemesAi)


export const aiRespnonseRoute=route