import express from "express";
import { meetingControllers } from "./meeting.contllors";
import auth from "../../middlewares/auth";


const router = express.Router();

// ✅ Create Meeting
router.post("/create-meeting",auth('companyAdmin'), meetingControllers.createMeetingIntoDb);

router.get(
  "/upcoming-meetings",
  auth("companyAdmin","companyEmployee"),
  meetingControllers.getUpcomingMeetingsFromDb
);

router.get(
  "/past-meetings",
  auth("companyAdmin","companyEmployee"), 
  meetingControllers.getPastMeetingsFromDb
);
router.get(
  "/upcoming-two-meetings",
  auth("companyAdmin","companyEmployee"),
  meetingControllers.getUpcomingLatestTwoMeetingsFromDb
);

router.get(
  "/past-two-meetings",
  auth("companyAdmin","companyEmployee"), 
  meetingControllers.getPastTWoMeetingsFromDb
);
// ✅ Get All Meetings
router.get("/get-all-meeting",auth('companyAdmin',"companyEmployee"), meetingControllers.getAllMeetingsFromDb);

// ✅ Get Single Meeting by ID
router.get("/:id",auth('companyAdmin',"companyEmployee"), meetingControllers.getSingleMeetingFromDb);

// ✅ Update Meeting by ID
router.patch("/:id",auth('companyAdmin',"companyEmployee"), meetingControllers.updateMeetingIntoDb);

// ✅ Delete Meeting by ID
router.delete("/:id",auth('companyAdmin'), meetingControllers.deleteMeetingFromDb);



export const meetingRoute= router;
