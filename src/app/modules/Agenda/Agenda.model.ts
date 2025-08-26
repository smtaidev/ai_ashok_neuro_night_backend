import mongoose, { Schema, Types } from "mongoose";

const TimeAllocatedSchema = new Schema({
  hours: { type: Number, required: true },
  minutes: { type: Number, required: true },
});

const AgendaItemSchema = new Schema({
  title: { type: String, required: true },
  presenter:  [{ type: Types.ObjectId, ref: 'Organization-User', required: true }],
  timeAllocated: { type: TimeAllocatedSchema, required: true },
  details: { type: String },
});

const AgendasSchema = new Schema(
  {
    companyName: { type: String, required: true },
    meetingId: { type: mongoose.Types.ObjectId, ref: "Meeting", required: true },
    inviteAttendees: {
      attendees:  [{ type: Types.ObjectId, ref: 'Organization-User', required: true }]
    },
    welcomeAndOpeningRemark: {
      presenter: [{ type: Types.ObjectId, ref: 'Organization-User', required: true }],
      timeAllocated: { type: TimeAllocatedSchema, required: true },
    },
    agendaItems: { type: [AgendaItemSchema], default: [] },
  },
  { timestamps: true }
);

export const AgendaSchema = mongoose.model("Agenda", AgendasSchema);
