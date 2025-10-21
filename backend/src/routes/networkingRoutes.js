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
router.get("/all-events", authenticate, networkingController.getAllEvents);
router.post("/events/favourite/:eventId", authenticate, networkingController.addEventToFavorites);
router.get("/events/favourite", authenticate, networkingController.getFavoriteEvents);
router.delete("/events/favourite/:eventId", authenticate, networkingController.removeEventFromFavorites);

// ---------- Reflection Routes ----------
router.post("/reflections", authenticate, networkingController.createReflection);
router.get("/reflections", authenticate, networkingController.getReflections);

// ---------- LinkedIn Post Routes ----------
router.post("/linkedin-post", authenticate, networkingController.createLinkedInPost);
router.put("/linkedin-post", authenticate, networkingController.updateLinkedInPost);
router.get("/linkedin-post", authenticate, networkingController.getLinkedInPost);

export default router;