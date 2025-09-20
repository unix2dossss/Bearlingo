import express from "express";
import * as networkingController from "../controllers/networkingController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/linkedin-profile", authenticate, networkingController.createLinkedInProfile);
router.put("/linkedin-profile", authenticate, networkingController.updateLinkedInProfile);
router.post("/events", authenticate, networkingController.createEventsToAttend);
router.put("/events", authenticate, networkingController.updateEventsToAttend);
router.post("/reflection", authenticate, networkingController.updateEventsToAttend);


// http://localhost:8080/api/users/me/networking/events
export default router;