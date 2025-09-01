import axios from "axios";
import Conversation from "./chat.model";


// const createChatBotIntoDb=async(userId:string,payload:{message:string})=>{


//      let conversation = await Conversation.findOne({ userId });

//   if (!conversation) conversation = new Conversation({ userId, messages: [] });

//   conversation.messages.push({ role: "user", message: payload.message });

//   console.log(conversation.messages)
// const allData=  {
//       ...payload,
//       session_id: conversation._id.toString(),
//       history: conversation.messages
//     }
//   console.log(allData)
//   const apiResponse = await axios.post(
//     "http://172.252.13.69:8026/api/chatbot/chatbot",
//     {
//       payload,
//       session_id: conversation._id.toString(),
//       history: conversation.messages
//     }
//   );

//   conversation.messages.push({ role: "bot", content: apiResponse.data.message });
//   await conversation.save();

//   return { message: apiResponse.data.message };

// }
interface Payload {
  message: string;
}

const createChatBotIntoDb = async (userId: string, payload: Payload) => {
  // 1. Find the conversation, or create a new one if it doesn't exist
  let conversation = await Conversation.findOne({ userId });
  if (!conversation) {
    conversation = new Conversation({ userId, messages: [] });
  }

  // 2. Add user's message
  if (!payload.message || payload.message.trim() === "") {
    throw new Error("User message cannot be empty");
  }
  conversation.messages.push({ role: "user", message: payload.message });

  // 3. Prepare history for API: convert to plain objects and remove _id
  const historyForApi = conversation.messages.map(msg => {
    const obj = msg.toObject();
    const { _id, ...rest } = obj;
    return rest;
  });

  // 4. Prepare API payload
  const apiPayload = {
    ...payload,
    session_id: conversation._id.toString(),
    history: historyForApi
  };


  // 5. Call external chatbot API
  const apiResponse = await axios.post(
    `${process.env.AI_URL}/api/chatbot/chatbot`,
    apiPayload
  );


  // 6. Add bot's response
  const botMessage = apiResponse.data.response || "No response from bot";
  conversation.messages.push({ role: "bot", message: botMessage });

  // 7. Save conversation
  await conversation.save();

  // 8. Return single conversation object instead of array
  const  history = await Conversation.findOne({ userId });

  return {  history,message: botMessage };
};

export const chatBotServices={
    createChatBotIntoDb
}