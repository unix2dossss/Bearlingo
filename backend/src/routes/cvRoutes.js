import express from "express";

//middlewares
import { authenticate } from "../middlewares/authMiddleware.js";

//controllers
import * as cvController from "../controllers/cvController.js";

const router = express.Router();

router.post("/personal-information", authenticate, cvController.addPersonalInformation);

export default router;