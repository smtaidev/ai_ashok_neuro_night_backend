
import { Schema, model } from "mongoose";

// Note Schema
const noteSchema = new Schema({
  userId: { type: String, required: true },
  noteText: { type: String, required: true },
}, { timestamps: true });

// AssessAlignmentCheck Schema
const assessAlignmentCheckSchema = new Schema({
  stakeholdersInvolved1: { type: [String], default: [] },
  stakeholdersInvolved2: { type: [String], default: [] },
  stakeholdersInvolved3: { type: [String], default: [] },
  sharedUnderstanding1: { type: [String], default: [] },
  sharedUnderstanding2: { type: [String], default: [] },
  sharedUnderstanding3: { type: [String], default: [] },
  onTrends: { type: [String], default: [] },
  onSwot: { type: [String], default: [] },
  onChallenges: { type: [String], default: [] },
  onCA: { type: [String], default: [] },
  notes: { type: [noteSchema], default: [] },
}, { timestamps: true });

const AssessAlignmentCheckModel = model("AssessAlignmentCheck", assessAlignmentCheckSchema);

export default AssessAlignmentCheckModel;
