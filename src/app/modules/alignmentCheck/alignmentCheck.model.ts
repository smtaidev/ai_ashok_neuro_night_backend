const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Answer Schema
const answerSchema = new Schema({
  questionNumber: { type: Number, required: true }, // questionId এর পরিবর্তে
  selectedOptions: {
    type: [String],
    default: [" "] // কোন answer না দিলে default " "
  }
});

// Selected Component Schema
const selectedComponentSchema = new Schema({
  name: { type: String, required: true }, // componentId এর পরিবর্তে
  checked: { type: Boolean, default: false }
});

// User Response Schema
const userResponseSchema = new Schema({
  title:{type:String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true }, // moduleId এর পরিবর্তে companyName
  answers: [answerSchema],
  selectedComponents: [selectedComponentSchema],
  suggestions: { type: String,default:"" },
}, { timestamps: true }); // createdAt & updatedAt auto generate হবে
const AssessAlignmentCheckModel = model("AssessAlignmentCheck", userResponseSchema);

export default AssessAlignmentCheckModel;
