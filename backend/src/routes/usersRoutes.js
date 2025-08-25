import express from "express";

//controllers
import { registerUser } from "../controllers/usersController.js";

//middlewares
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

export default router;
