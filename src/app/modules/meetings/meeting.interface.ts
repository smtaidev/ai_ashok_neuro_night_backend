import { Document, Types } from "mongoose";

export type MeetingStatus = 
  | "Not Started" 
  | "In Progress" 
  | "Need More Information" 
  | "Done";

export interface IMeeting extends Document {
 companyName:string
  name: string;
  location: string;
   agendaId?:Types.ObjectId;
  type: string;
  meetingDate: Date;
  startDate: Date;
  endDate: Date;
  meetingLength: string;
  owner: string;
  description?: string;
  status: MeetingStatus;
  createdAt: Date;
  updatedAt: Date;
   agendaItems?:string
}
