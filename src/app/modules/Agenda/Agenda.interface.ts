import { Types } from "mongoose";

// export interface ITimeAllocated {
//   hours: number;
//   minutes: number;
// }

// export interface IAgendaItem {
//   title: string;
//   presenter: Types.ObjectId[];
//   timeAllocated: ITimeAllocated;
//   details?: string; // optional
// }

// export interface IAgenda {
//   meetingId?: Types.ObjectId;
//   companyName:string;
//   inviteAttendees: {
//     attendees:  Types.ObjectId[];
//   };
//   welcomeAndOpeningRemark: {
//     presenter:  Types.ObjectId[];
//     timeAllocated: ITimeAllocated;
//   };
//   agendaItems: IAgendaItem[];
//   createdAt?: Date;
//   updatedAt?: Date;
// }

export interface ITimeAllocated {
  hours: number;
  minutes: number;
}

 export interface IAgendaItem {
  title: string;
  presenter: string[]; // initially string IDs, convert to ObjectId
  timeAllocated: ITimeAllocated;
  details?: string;
}

export interface IWelcomeAndOpeningRemark {
  presenter: string[];
  timeAllocated: ITimeAllocated;
}

interface IInviteAttendees {
  attendees: string[];
}

export interface IAgenda {
  welcomeAndOpeningRemark?: IWelcomeAndOpeningRemark;
  inviteAttendees?: IInviteAttendees;
  agendaItems?: IAgendaItem[];
}
 