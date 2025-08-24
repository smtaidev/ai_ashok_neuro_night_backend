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
  const result = await Meeting.find(query).populate("agendaItems");
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
  const result = await Meeting.findOne(query).populate("agendaItems");
  if (!result) {
    throw new AppError(status.NOT_FOUND, "Meeting not found!");
  }
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

const getPastMeetingsFromDb = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }

  const now = new Date(); // এখনকার সময়

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    endDate: { $lt: now } 
  };

  const result = await Meeting.find(query).sort({ endDate: -1 }); // latest finished first
  return result;
};


export const meetingsServices={
    createMeetingIntoDb,
    updateMeetingIntoDb,
    deleteMeetingFromDb,
    getAllMeetingsFromDb,
    getSingleMeetingFromDb,
    getUpcomingMeetingsFromDb,
    getPastMeetingsFromDb
}