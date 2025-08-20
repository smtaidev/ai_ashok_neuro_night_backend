import mongoose, { Schema, model } from "mongoose";
import { IMeeting } from "./meeting.interface";


const meetingSchema = new Schema<IMeeting>(
  { 
    companyName:{ type: String, required: true },
     agendaItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Agenda" }],
    name: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    meetingDate: { type: Date, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    meetingLength: { type: String, required: true },
    owner: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Need More Information", "Done"],
      default: "Not Started",
    },
    
  },
  { timestamps: true }
);

export const Meeting = model<IMeeting>("Meeting", meetingSchema);
