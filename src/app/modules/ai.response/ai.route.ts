
import express from 'express'
import { aiRespnonseContllors } from './ai.contllors'
import auth from '../../middlewares/auth'

const route=express.Router()
route.get("/ai-trend",auth("companyAdmin"),aiRespnonseContllors.getTrendAirecommendations)
route.get("/ai-swot",auth("companyAdmin"),aiRespnonseContllors.getSwotirecommendations)
route.get("/ai-challenge",auth("companyAdmin"),aiRespnonseContllors.getSwotirecommendations)


export const aiRespnonseRoute=route