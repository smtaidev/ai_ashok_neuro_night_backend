import { model, Schema } from "mongoose";
import { v4 } from "uuid";


const StrategicThemeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
});

const BusinessGoalSchema = new Schema({
  title: { type: String, required: true },
  priorityLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  department: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  completeness: { type: Number, min: 0, max: 100, required: true },
  challengesAndRisk: { type: String, required: true },
  changeManagement: { type: String, required: true },
  culturalRealignment: { type: String, required: true },
  Ld: { type: String, required: true } // For Learning & Development
});

const BlueprintSchema = new Schema({
  companyName: { type: String, required: true }, // assuming Company collection
  vision: { type: String, default: "" },
  strategicThemes: { type: [StrategicThemeSchema], default: [] },
  businessGoals: { type: [BusinessGoalSchema], default: [] }
}, { timestamps: true });

export const BlueprintModel = model('Blueprint', BlueprintSchema);