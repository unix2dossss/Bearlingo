import express from "express";

//middlewares
import { authenticate } from "../middlewares/authMiddleware.js";

//controllers
import * as interviewController from "../controllers/interviewController.js";

const router = express.Router();

router.post("/company-research", authenticate, interviewController.addCompanyResearch);
router.get("/company-researches", authenticate, interviewController.getCompanyResearches);
router.delete("/company-research/:id", authenticate, interviewController.deleteCompanyResearch);
router.post("/reflection-journal", authenticate, interviewController.addReflectionJournal);
router.get("/reflection-journal", authenticate, interviewController.getReflectionJournal);
router.get("/preparation-record", authenticate, interviewController.getInterviewPrepRecord);

export default router;