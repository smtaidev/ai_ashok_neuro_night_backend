import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { meetingsServices } from "./meeting.services";


// ✅ Create Meeting
const createMeetingIntoDb = catchAsync(async (req, res) => {
    const company=req.user
    console.log(company)
  const result = await meetingsServices.createMeetingIntoDb(company?.companyName,req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Meeting created successfully",
    data: result,
  });
});

// ✅ Get All Meetings
const getAllMeetingsFromDb = catchAsync(async (req, res) => {
    const company=req.user
  const result = await meetingsServices.getAllMeetingsFromDb(company?.companyName);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All meetings retrieved successfully",
    data: result,
  });
});

// ✅ Get Single Meeting by ID
const getSingleMeetingFromDb = catchAsync(async (req, res) => {
       const company=req.user
  const { id } = req.params;
  const result = await meetingsServices.getSingleMeetingFromDb(company.companyName,id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Meeting retrieved successfully",
    data: result,
  });
});

// ✅ Update Meeting
const updateMeetingIntoDb = catchAsync(async (req, res) => {
  const { id } = req.params;
     const company=req.user
  const result = await meetingsServices.updateMeetingIntoDb(company.companyName,id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Meeting updated successfully",
    data: result,
  });
});

// ✅ Delete Meeting
const deleteMeetingFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;
    const company=req.user
  const result = await meetingsServices.deleteMeetingFromDb(company.companyName,id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Meeting deleted successfully",
    data: result,
  });
});
const getUpcomingMeetingsFromDb = catchAsync(async (req, res) => {
  const company = req.user; // auth middleware থেকে company info
  console.log(company.companyName)
  const result = await meetingsServices.getUpcomingMeetingsFromDb(
    company?.companyName
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Upcoming meetings retrieved successfully",
    data: result,
  });
});

const getPastMeetingsFromDb = catchAsync(async (req, res) => {
  const company = req.user; // auth middleware থেকে company info
  const result = await meetingsServices.getPastMeetingsFromDb(
    company?.companyName
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Past meetings retrieved successfully",
    data: result,
  });
});
const getUpcomingLatestTwoMeetingsFromDb = catchAsync(async (req, res) => {
  const company = req.user; // auth middleware থেকে company info
  console.log(company.companyName)
  const result = await meetingsServices.getUpcomingLatestTwoMeetingsFromDb(
    company?.companyName,
    // company.userId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Upcoming 2 meetings retrieved successfully",
    data: result,
  });
});

const getPastTWoMeetingsFromDb = catchAsync(async (req, res) => {
  const company = req.user; // auth middleware থেকে company info
  const result = await meetingsServices.getPastTWoMeetingsFromDb(
    company?.companyName,
    // company.userId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Past 2 meetings retrieved successfully",
    data: result,
  });
});


export const meetingControllers = {
  createMeetingIntoDb,
  getAllMeetingsFromDb,
  getSingleMeetingFromDb,
  updateMeetingIntoDb,
  deleteMeetingFromDb,
  getUpcomingMeetingsFromDb,
  getPastMeetingsFromDb,
  getPastTWoMeetingsFromDb,
  getUpcomingLatestTwoMeetingsFromDb
};
