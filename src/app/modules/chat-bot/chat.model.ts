// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema({
//   role: { type: String, enum: ["user", "bot"], required: true },
//   message: { type: String, required: true }
// });

// const conversationSchema = new mongoose.Schema(
//   {
//     userId: { type: String, required: false }, // optional, যদি login system থাকে
//     messages: [messageSchema]
//   },
//   { timestamps: true } // createdAt, updatedAt automatically
// );

// const Conversation = mongoose.model("Conversation", conversationSchema);

// export default Conversation;
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "bot"], required: true },
  message: { type: String, required: true }
});

// One-to-one conversation per user
const conversationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true }, // unique ensures one conversation per user
    messages: [messageSchema]
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
