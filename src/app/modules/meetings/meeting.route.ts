import express from "express";
import { meetingControllers } from "./meeting.contllors";
import auth from "../../middlewares/auth";


const router = express.Router();

// ✅ Create Meeting
router.post("/create-meeting",auth('companyAdmin'), meetingControllers.createMeetingIntoDb);

// ✅ Get All Meetings
router.get("/get-all-meeting",auth('companyAdmin'), meetingControllers.getAllMeetingsFromDb);

// ✅ Get Single Meeting by ID
router.get("/:id",auth('companyAdmin'), meetingControllers.getSingleMeetingFromDb);

// ✅ Update Meeting by ID
router.patch("/:id",auth('companyAdmin'), meetingControllers.updateMeetingIntoDb);

// ✅ Delete Meeting by ID
router.delete("/:id",auth('companyAdmin'), meetingControllers.deleteMeetingFromDb);

export const meetingRoute= router;
