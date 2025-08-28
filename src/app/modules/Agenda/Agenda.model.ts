import mongoose, { model, Schema, Types } from "mongoose";

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




const TimeAllocateAssignSchema = new Schema({
  hours: { type: Number, required: true },
  minutes: { type: Number, required: true },
});

const AgendaItemAssignSchema = new Schema({
  title: { type: String, required: true },
  presenter:  [{ type: Types.ObjectId, ref: 'Organization-User', required: true }],
  timeAllocated: { type: TimeAllocatedSchema, required: true },
  details: { type: String },
  status:{
      type: String,
      enum: ["Not Started", "In Progress", "Need More Information", "Done"],
      default: "Not Started",
    },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  notes:{type:String,required:true}
});

const AssignMeSchema = new Schema(
  {
    companyName: { type: String, required: true },
    meetingId: { type: mongoose.Types.ObjectId, ref: "Meeting", required: true },
     userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    inviteAttendees: {
      attendees:  [{ type: Types.ObjectId, ref: 'Organization-User', required: true }]
    },
    welcomeAndOpeningRemark: {
      presenter: [{ type: Types.ObjectId, ref: 'Organization-User', required: true }],
      timeAllocated: { type: TimeAllocateAssignSchema, required: true },
    },
    agendaItems: { type: [AgendaItemAssignSchema], default: [] },
  },
  { timestamps: true }
);
export const AssignToMeMeeting= model("AssignMeMeeting",AssignMeSchema)