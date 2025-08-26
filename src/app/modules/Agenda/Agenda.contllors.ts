import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { agendaServices } from "./Agenda.services";

// ✅ Create Agenda
const createAgendaIntoDb = catchAsync(async (req, res) => {
  const company = req.user;
  const {id}=req.params
  const result = await agendaServices.createAgenda(id,company?.companyName, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Agenda created successfully",
    data: result,
  });
});

// ✅ Get All Agendas
const getAllAgendasFromDb = catchAsync(async (req, res) => {
  const company = req.user;
  const {id}=req.params
  const result = await agendaServices.getAllAgendas(company?.companyName,id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All agendas retrieved successfully",
    data: result,
  });
});

// ✅ Get Single Agenda by ID
const getSingleAgendaFromDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;
  const {meetingId}=req.body
  const result = await agendaServices.getSingleAgenda(company.companyName, id,meetingId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Agenda retrieved successfully",
    data: result,
  });
});

// ✅ Update Agenda
const updateAgendaIntoDb = catchAsync(async (req, res) => {
  const { id ,meetingId} = req.params;
  const company = req.user;
  const result = await agendaServices.updateAgenda(company.companyName, id,meetingId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Agenda updated successfully",
    data: result,
  });
});

// ✅ Delete Agenda
const deleteAgendaFromDb = catchAsync(async (req, res) => {
  const { id,  meetingId } = req.params;
  const company = req.user;
  const result = await agendaServices.deleteAgenda(company.companyName, id,  meetingId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Agenda deleted successfully",
    data: result,
  });
});
const  getAgendasByUser = catchAsync(async (req, res) => {
  const { id} = req.params;
  const company = req.user;
  const result = await agendaServices.getAgendasByUser(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My Agenda  successfully get",
    data: result,
  });
});

export const agendaControllers = {
  createAgendaIntoDb,
  getAllAgendasFromDb,
  getSingleAgendaFromDb,
  updateAgendaIntoDb,
  deleteAgendaFromDb,
  getAgendasByUser
};
