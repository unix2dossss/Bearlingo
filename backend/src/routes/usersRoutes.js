import express from "express";

//controllers
import { registerUser, loginUserToken, getUserInfo, deleteUser, addUser, getCompletedLevels } from "../controllers/usersController.js";

//middlewares
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUserToken);
router.get("/add", addUser);
router.get("/:id", getUserInfo);
router.delete("/:id", deleteUser);
router.get("/:id/completed-levels", getCompletedLevels);
// router.get(":id")
export default router;
