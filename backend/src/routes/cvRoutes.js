import express from "express";

//middlewares
import { authenticate } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/fileUploadMiddleware.js";
import {dailyRequestLimiter} from "../middlewares/rateLimiter.js";

//controllers
import * as cvController from "../controllers/cvController.js";

const router = express.Router();

router.post("/personal-information", authenticate, cvController.addPersonalInformation);
router.post("/skills", authenticate, cvController.addSkills);
router.post("/projects", authenticate, cvController.addProjects);
router.post("/work-experience", authenticate, cvController.addWorkExperience);
router.get("/", authenticate, cvController.getCV);
router.get("/preview", authenticate, cvController.getPreviewCV);
router.get("/download", authenticate, cvController.downloadCV);
router.post("/upload", authenticate, upload.single("cv"), cvController.uploadCV);
router.delete("/delete", authenticate, cvController.deleteCV);
router.get("/pdf", authenticate, cvController.getPdfCVFromDB);
router.get("/analyze-cv", authenticate, dailyRequestLimiter, upload.single("cv"), cvController.analyzeCV);

export default router;