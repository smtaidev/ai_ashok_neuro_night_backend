import mongoose, { Schema } from "mongoose";

const TimeAllocatedSchema = new Schema({
  hours: { type: Number, required: true },
  minutes: { type: Number, required: true },
});

const AgendaItemSchema = new Schema({
  title: { type: String, required: true },
  presenter: { type: [String], required: true },
  timeAllocated: { type: TimeAllocatedSchema, required: true },
  details: { type: String },
});

const MeetingSchema = new Schema(
  {
    companyName: { type: String, required: true },
    meetingId: { type: mongoose.Types.ObjectId, required: true },
    inviteAttendees: {
      attendees: { type: [String], required: true },
    },
    welcomeAndOpeningRemark: {
      presenter: { type: [String], required: true },
      timeAllocated: { type: TimeAllocatedSchema, required: true },
    },
    agendaItems: { type: [AgendaItemSchema], default: [] },
  },
  { timestamps: true }
);

export const AgendaSchema = mongoose.model("Agenda", MeetingSchema);
