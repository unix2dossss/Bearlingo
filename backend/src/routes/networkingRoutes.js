import express from "express";
import * as networkingController from "../controllers/networkingController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ---------- LinkedIn Profile Routes ----------
router.post("/linkedin-profile", authenticate, networkingController.createLinkedInProfile);
router.put("/linkedin-profile", authenticate, networkingController.updateLinkedInProfile);
router.get("/linkedin-profile", authenticate, networkingController.getLinkedInProfile);

// ---------- Events Routes ----------
router.post("/events", authenticate, networkingController.createEventsToAttend);
router.put("/events", authenticate, networkingController.updateEventsToAttend);
router.get("/events", authenticate, networkingController.getEventsToAttend);

// ---------- Reflection Routes ----------
router.post("/reflection", authenticate, networkingController.createReflection);
router.get("/reflection", authenticate, networkingController.createReflection);

// ---------- LinkedIn Post Routes ----------
router.post("/linkedin-post", authenticate, networkingController.createLinkedInPost);
router.put("/linkedin-post", authenticate, networkingController.updateLinkedInPost);
router.get("/reflection", authenticate, networkingController.createReflection);

export default router;