import status from "http-status";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";
import { AgendaSchema } from "./Agenda.model";
import { IAgenda } from "./Agenda.interface";
import { Meeting } from "../meetings/meeting.model";

// ✅ Create Agenda
// const createAgenda = async (
//   meetingId: string,
//   companyName: string,
//   payload: IAgenda
// ) => {
//   if (!payload) {
//     throw new AppError(status.BAD_REQUEST, "Agenda data is required!");
//   }
//   const payloadData = { ...payload, companyName, meetingId };
//   const result = await AgendaSchema.create(payloadData);
//   await Meeting.findByIdAndUpdate(meetingId, { $push: { agendaItems: result._id } });
//   return result;
// };

const createAgenda = async (
  meetingId: string,
  companyName: string,
  payload: IAgenda
) => {
  if (!payload) {
    throw new AppError(status.BAD_REQUEST, "Agenda data is required!");
  }

  // Find existing agenda
  let existingAgenda = await AgendaSchema.findOne({ meetingId, companyName });

  if (existingAgenda) {
    // Update welcomeAndOpeningRemark if present
    if (payload.welcomeAndOpeningRemark) {
      existingAgenda.welcomeAndOpeningRemark = payload.welcomeAndOpeningRemark;
    }

    // Update inviteAttendees if present
    if (payload.inviteAttendees) {
      existingAgenda.inviteAttendees = payload.inviteAttendees;
    }

    // Replace agendaItems (max 15)
    existingAgenda.agendaItems.splice(0, existingAgenda.agendaItems.length); // clear existing
    if (payload.agendaItems && payload.agendaItems.length > 0) {
      payload.agendaItems.slice(0, 15).forEach((item) => {
        existingAgenda.agendaItems.push(item as any);
      });
    }

    const updatedAgenda = await existingAgenda.save();

    console.log(updateAgenda)
    // Update Meeting.agendaId properly
    await Meeting.findByIdAndUpdate(
      meetingId,
      { $set: { agendaId: existingAgenda._id } }, // ObjectId directly
      { new: true }
    );

    return updatedAgenda;
  } else {
    // Create new agenda
    const agendaToSave = {
      ...payload,
      meetingId,
      companyName,
    };

    const newAgenda = await AgendaSchema.create(agendaToSave);
  
    await Meeting.findByIdAndUpdate(
      meetingId,
      { $set: { agendaId: newAgenda._id  } },
      { new: true }
    );

    console.log('check data', existingAgenda)
    return newAgenda;
  }
};

// ✅ Get All Agendas
const getAllAgendas = async (companyName: string,meetingId:string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    meetingId: new mongoose.Types.ObjectId(meetingId),
  };
  const result = await AgendaSchema.find(query).populate("meetingId")
  return result;
};

// ✅ Get Single Agenda
const getSingleAgenda = async (companyName: string, id: string,meetingId:string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid Agenda ID!");
  }
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    _id: new mongoose.Types.ObjectId(id),
    meetingId: new mongoose.Types.ObjectId(meetingId),
  };
  const result = await AgendaSchema.findOne(query).populate("meetingId")
  if (!result) {
    throw new AppError(status.NOT_FOUND, "Agenda not found!");
  }
  return result;
};

// ✅ Update Agenda

const updateAgenda = async (
  companyName: string,
  agendaId: string,
  meetingId:string,
  payload: Partial<IAgenda>
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }
  if (!mongoose.Types.ObjectId.isValid(agendaId)) {
    throw new AppError(status.BAD_REQUEST, "Invalid Agenda ID!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    _id: new mongoose.Types.ObjectId(agendaId),
    meetingId: new mongoose.Types.ObjectId(meetingId)
  };

  // Update the document
  const updatedAgenda = await AgendaSchema.findByIdAndUpdate(query, payload, {
    new: true,
    runValidators: true,
  }).lean(); // returns plain JS object

  if (!updatedAgenda) {
    throw new AppError(status.NOT_FOUND, "Agenda not found!");
  }

  // ✅ TypeScript safe delete
  if ("__v" in updatedAgenda) {
    delete (updatedAgenda as any).__v;
  }

  // Optional: remove _id if চাইলে

  return updatedAgenda;
};


// ✅ Delete Agenda
const deleteAgenda = async (companyName: string, id: string,  meetingId:string,) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid Agenda ID!");
  }
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    _id: new mongoose.Types.ObjectId(id),
    meetingId: new mongoose.Types.ObjectId(meetingId),
  };
  const result = await AgendaSchema.deleteOne(query);
  if (!result.deletedCount) {
    throw new AppError(status.NOT_FOUND, "Agenda not found!");
  }
  return result;
};

export const agendaServices = {
  createAgenda,
  getAllAgendas,
  getSingleAgenda,
  updateAgenda,
  deleteAgenda,
};
