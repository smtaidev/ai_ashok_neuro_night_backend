
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { chatBotServices } from "./chat.services";

const createChatBot=catchAsync(async(req,res)=>{
const {userId}=req.user



    const result= await chatBotServices.createChatBotIntoDb(userId,req.body)
     sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Ai successfully responses in your message",
    data: result,
  });
})

export const chatbotcontllors={
    createChatBot
}