
import express from 'express'
import { aiRespnonseContllors } from './ai.contllors'
import auth from '../../middlewares/auth'

const route=express.Router()
route.get("/ai-trend",auth("companyAdmin"),aiRespnonseContllors.getTrendAirecommendations)


export const aiRespnonseRoute=route