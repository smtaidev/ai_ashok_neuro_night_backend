import express from "express";
import auth from "../../middlewares/auth";
import { agendaControllers } from "./Agenda.contllors";

const router = express.Router();

// ✅ Create Agenda
router.post("/create-agenda/:id", auth("companyAdmin"), agendaControllers.createAgendaIntoDb);

router.post("/create-assign-agenda/:id", auth("companyAdmin","companyEmployee"), agendaControllers.CreateAssignToMeAgenda);

// ✅ Get All Agendas
router.get("/get-all-agenda/:id", auth("companyAdmin","companyEmployee"), agendaControllers.getAllAgendasFromDb);
router.get("/get-my-agenda", auth("companyAdmin","companyEmployee"), agendaControllers.getAgendasByUser);
router.get("/get-my-all-agenda/:id", auth("companyAdmin",'companyEmployee'), agendaControllers.getMyAgendasByUserId);

// ✅ Get Single Agenda by ID
router.get("/:id", auth("companyAdmin","companyEmployee"), agendaControllers.getSingleAgendaFromDb);

// ✅ Update Agenda by ID
router.patch("/:id/update-agenda/:meetingId", auth("companyAdmin","companyEmployee"), agendaControllers.updateAgendaIntoDb);
router.get(
  "/:meetingId/my-single-agenda",
  auth("companyAdmin", "companyEmployee"),
  agendaControllers.getSingleAssignToMeAgenda
);
// ✅ Delete Agenda by ID
router.delete("/:id/delete-agenda/:meetingId", auth("companyAdmin"), agendaControllers.deleteAgendaFromDb);

export const agendaRoute = router;
