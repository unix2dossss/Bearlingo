import express from "express";

//controllers
import { registerUser, loginUserToken, getUserInfo } from "../controllers/usersController.js";

//middlewares
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUserToken);
router.get("/:id", getUserInfo);

export default router;
