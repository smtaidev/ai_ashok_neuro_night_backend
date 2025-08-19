import status from "http-status";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";
import { AgendaSchema } from "./Agenda.model";
import { IAgenda } from "./Agenda.interface";

// ✅ Create Agenda
const createAgenda = async (
  meetingId: string,
  companyName: string,
  payload: IAgenda
) => {
  if (!payload) {
    throw new AppError(status.BAD_REQUEST, "Agenda data is required!");
  }
  const payloadData = { ...payload, companyName, meetingId };
  const result = await AgendaSchema.create(payloadData);
  return result;
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
  const result = await AgendaSchema.find(query);
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
  const result = await AgendaSchema.findOne(query);
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
