import express from "express";

//controllers
import * as usersController from "../controllers/usersController.js";

//middlewares
import { authenticate } from "../middlewares/authMiddleware.js";
import { validateRegisterInputs, handleValidationErrors } from "../middlewares/inputValidators.js";

const router = express.Router();

router.post("/register", validateRegisterInputs, handleValidationErrors, usersController.registerUser);
router.post("/login", usersController.loginUserToken);
router.post("/logout", usersController.logoutUser);
router.get("/add", usersController.addUser);
router.get("/:id", usersController.getUserInfo);
router.delete("/:id", usersController.deleteUser);
router.get("/", usersController.getAllUsers);
router.get("/:id/completed-levels", usersController.getCompletedLevels);
router.get("/:id/streaks", usersController.getStreak);
// router.get(":id")
export default router;
