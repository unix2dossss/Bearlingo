import express from "express";

//middlewares
import { authenticate } from "../middlewares/authMiddleware.js";

//controllers
import * as cvController from "../controllers/cvController.js";

const router = express.Router();

router.post("/personal-information", authenticate, cvController.addPersonalInformation);
router.post("/skills", authenticate, cvController.addSkills);
router.post("/projects", authenticate, cvController.addProjects);
router.post("/work-experience", authenticate, cvController.addWorkExperience);
router.get("/", authenticate, cvController.getCV);

export default router;