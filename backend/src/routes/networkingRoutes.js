import express from "express";
import * as networkingController from "../controllers/networkingController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/linkedin-profile", authenticate, networkingController.addLinkedInProfile);
router.put("/linkedin-profile", authenticate, networkingController.updateLinkedInProfile);

export default router;