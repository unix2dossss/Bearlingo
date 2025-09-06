import express from "express";

//middlewares
import { authenticate } from "../middlewares/authMiddleware.js";

//controllers
import * as interviewController from "../controllers/interviewController.js";

const router = express.Router();

router.post("/company-research", authenticate, interviewController.addCompanyResearch);

export default router;