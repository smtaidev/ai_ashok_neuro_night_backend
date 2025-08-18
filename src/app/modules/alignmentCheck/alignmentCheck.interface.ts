import { Types } from "mongoose";

interface Answer {
  questionNumber: number;
  selectedOptions: string[]; // default: [" "] যদি কোনো answer না থাকে
}

interface SelectedComponent {
  name: string;
  checked: boolean; // default: false
}

export interface AssessAlignmentCheck {
  title: string;
  userId: Types.ObjectId;
  companyName: string;
  answers: Answer[];
  selectedComponents: SelectedComponent[];
  suggestions?: string; // default: ""
  createdAt?: Date; // timestamps
  updatedAt?: Date; // timestamps
}