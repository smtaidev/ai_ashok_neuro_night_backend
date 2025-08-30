import express from "express";

import auth from "../../middlewares/auth";
import { talentOverviewControllers } from "./Talent.contllors";

const router = express.Router();

// ✅ Create Task
router.post("/create-talent", auth("companyAdmin"),talentOverviewControllers.createTalentOverviewIntoDb);

// ✅ Get All Tasks
router.get("/get-all-talent", auth("companyAdmin","companyEmployee"), talentOverviewControllers.getAllTalentOverviewFromDb);

// ✅ Get Single Task
router.get("/:id", auth("companyAdmin","companyEmployee"), talentOverviewControllers.getSingleTalentOverviewFromDb);

// ✅ Update Task
router.patch("/:id", auth("companyAdmin","companyEmployee"), talentOverviewControllers.updateTalentOverviewIntoDb);

// ✅ Delete Task
router.delete("/:id", auth("companyAdmin"), talentOverviewControllers.deleteTalentOverviewFromDb);

export const TalentRoute = router;
