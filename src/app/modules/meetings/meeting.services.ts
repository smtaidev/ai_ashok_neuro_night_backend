import status from "http-status";
import AppError from "../../errors/AppError";
import { IMeeting } from "./meeting.interface";
import { Meeting } from "./meeting.model";
import mongoose from "mongoose";

 const createMeetingIntoDb = async (companyName:string,payload: IMeeting) => {
  if (!payload.name) {
    throw new AppError(status.BAD_REQUEST, "Meeting name is required!");
  }
const payloadData={...payload,companyName:companyName}
console.log(payloadData)
  const result = await Meeting.create(payloadData);
  return result;
};

 const getAllMeetingsFromDb = async (companyName:string) => {
        if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  console.log(companyName)
  const result = await Meeting.find(query).populate("agendaId");
  console.log(result)
  return result;
};


 const getSingleMeetingFromDb = async (companyName:string,id: string) => {
       if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }
 
const query = {
  companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  _id: new mongoose.Types.ObjectId(id), 
};
  const result = await Meeting.findOne(query).populate("agendaId");
  if (!result) {
    throw new AppError(status.NOT_FOUND, "Meeting not found!");
  }
  console.log(result)
  return result;
};

// ✅ Update Meeting
 const updateMeetingIntoDb = async (companyName:string,id: string, payload: Partial<IMeeting>) => {

     if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }
 
const query = {
  companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  _id: new mongoose.Types.ObjectId(id), 
};
  const result = await Meeting.findByIdAndUpdate(query, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Meeting not found!");
  }

  return result;
};

// ✅ Delete Meeting
 const deleteMeetingFromDb = async (companyName:string,id: string) => {

           if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "company name is not found !");
  }
 
const query = {
  companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  _id: new mongoose.Types.ObjectId(id), 
};
  const result = await Meeting.deleteOne(query)

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Meeting not found!");
  }

  return result;
};

const getUpcomingMeetingsFromDb = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }

  const today = new Date();

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    meetingDate: { $gt: today } 
  };

  const result = await Meeting.find(query).sort({ meetingDate: 1 }); // date ascending
  return result;
};


// const getUpcomingLatestTwoMeetingsFromDb = async (companyName: string) => {
//   if (!companyName) {
//     throw new AppError(status.BAD_REQUEST, "Company name is required!");
//   }

//   // আজকের date, time ignore করে
//   const today = new Date();
//   today.setHours(0, 0, 0, 0); // শুধু date, time 00:00:00

//   const query = {
//     companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
//     meetingDate: { $gte: today } // আজ এবং পরের দিনগুলো
//   };

//   const result = await Meeting.find(query)
//     .sort({ meetingDate: 1 }) // সবচেয়ে কাছের মিটিং আগে
//     .limit(2) // শুধু ২টা
//     .populate("agendaId"); // agendaId এর ডেটা নিয়ে আসে

//     console.log
//   return result;
// };

const getUpcomingLatestTwoMeetingsFromDb = async (companyName: string, presenterId: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }
  if (!presenterId) {
    throw new AppError(status.BAD_REQUEST, "Presenter ID is required!");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    meetingDate: { $gte: today }
  };

  let meetings = await Meeting.find(query)
    .sort({ meetingDate: 1 })
    .limit(2)
    .populate("agendaId")
    .lean() as any[]; // <-- any দিয়ে TypeScript চেক বাদ দিলাম

  // Filter meetings where agendaItems.presenter contains presenterId
  meetings = meetings.filter(meeting => {
    if (!meeting.agendaId || !meeting.agendaId.agendaItems) return false;

    return meeting.agendaId.agendaItems.some((item: any) =>
      item.presenter.some((id: any) => String(id) === String(presenterId))
    );
  });

  return meetings;
};
const getPastMeetingsFromDb = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }

  const now = new Date(); // এখনকার সময়

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    endDate: { $lt: now } 
  };

  const result = await Meeting.find(query).sort({ endDate: -1 }).populate("agendaId"); // latest finished first
  return result;
};
// const getPastTWoMeetingsFromDb= async (companyName: string) => {
//   if (!companyName) {
//     throw new AppError(status.BAD_REQUEST, "Company name is required!");
//   }

//   const now = new Date(); // এখনকার সময়

//   const query = {
//     companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
//     endDate: { $lt: now } // শেষ হয়ে গেছে
//   };

//   const result = await Meeting.find(query)
//     .sort({ endDate: -1 }).populate("agendaId")// সর্বশেষ শেষ হওয়া আগে
//     .limit(2); // শুধু ২টা
//   return result;
// };

// const actionItemAssignToMe=async(userId:IdleDeadline, payload)=>{


// }
const getPastTWoMeetingsFromDb = async (companyName: string, presenterId: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }
  if (!presenterId) {
    throw new AppError(status.BAD_REQUEST, "Presenter ID is required!");
  }

  const now = new Date();

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    endDate: { $lt: now } // শেষ হয়ে গেছে
  };

  let meetings = await Meeting.find(query)
    .sort({ endDate: -1 }) // সর্বশেষ শেষ হওয়া আগে
    .limit(10) // প্রাথমিকভাবে বেশি নিয়ে আসি, পরে filter করবে
    .populate("agendaId")
    .lean() as any[];

  // Filter meetings where agendaItems.presenter contains presenterId
  meetings = meetings.filter(meeting => {
    if (!meeting.agendaId || !meeting.agendaId.agendaItems) return false;

    return meeting.agendaId.agendaItems.some((item: any) =>
      item.presenter.some((id: any) => String(id) === String(presenterId))
    );
  });

  // শেষ পর্যন্ত 2টা ফিরিয়ে দাও
  return meetings.slice(0, 2);
};

export const meetingsServices={
    createMeetingIntoDb,
    updateMeetingIntoDb,
    deleteMeetingFromDb,
    getAllMeetingsFromDb,
    getSingleMeetingFromDb,
    getUpcomingMeetingsFromDb,
    getPastMeetingsFromDb,
    getUpcomingLatestTwoMeetingsFromDb,
    getPastTWoMeetingsFromDb
}