import express from "express";
import auth from "../../middlewares/auth";
import { agendaControllers } from "./Agenda.contllors";

const router = express.Router();

// ✅ Create Agenda
router.post("/create-agenda/:id", auth("companyAdmin"), agendaControllers.createAgendaIntoDb);

// ✅ Get All Agendas
router.get("/get-all-agenda/:id", auth("companyAdmin"), agendaControllers.getAllAgendasFromDb);
router.get("/get-my-agenda/:id", auth("companyAdmin"), agendaControllers.getAgendasByUser);

// ✅ Get Single Agenda by ID
router.get("/:id", auth("companyAdmin"), agendaControllers.getSingleAgendaFromDb);

// ✅ Update Agenda by ID
router.patch("/:id/update-agenda/:meetingId", auth("companyAdmin"), agendaControllers.updateAgendaIntoDb);

// ✅ Delete Agenda by ID
router.delete("/:id/delete-agenda/:meetingId", auth("companyAdmin"), agendaControllers.deleteAgendaFromDb);

export const agendaRoute = router;
