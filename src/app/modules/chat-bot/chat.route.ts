import express from 'express'
import auth from '../../middlewares/auth'
import { chatbotcontllors } from './chat.contllors'

const route =express.Router()
route.post('/create-chat',auth("companyAdmin",'companyEmployee',"superAdmin"),chatbotcontllors.createChatBot)


export const chatBotRoute=route