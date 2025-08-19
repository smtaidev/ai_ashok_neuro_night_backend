import { Types } from "mongoose";

export interface ITimeAllocated {
  hours: number;
  minutes: number;
}

export interface IAgendaItem {
  title: string;
  presenter: string[];
  timeAllocated: ITimeAllocated;
  details?: string; // optional
}

export interface IAgenda {
  meetingId?: Types.ObjectId;
  companyName:string;
  inviteAttendees: {
    attendees: string[];
  };
  welcomeAndOpeningRemark: {
    presenter: string[];
    timeAllocated: ITimeAllocated;
  };
  agendaItems: IAgendaItem[];
  createdAt?: Date;
  updatedAt?: Date;
}
