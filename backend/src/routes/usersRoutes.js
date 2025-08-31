import express from "express";

//controllers
import * as usersController from "../controllers/usersController.js";

//middlewares
import { authenticate } from "../middlewares/authMiddleware.js";
import { validateRegisterInputs, validateProfileUpdateInputs, handleValidationErrors } from "../middlewares/inputValidators.js";

const router = express.Router();

router.post("/register", validateRegisterInputs, handleValidationErrors, usersController.registerUser);
router.post("/login", usersController.loginUser);
router.post("/logout", usersController.logoutUser);
router.put("/profile", authenticate, validateProfileUpdateInputs, handleValidationErrors, usersController.updateUserProfile);
router.get("/add", usersController.addUser);
router.get("/", authenticate, usersController.getUserInfo);
router.delete("/", authenticate, usersController.deleteUser);
router.get("/", authenticate, usersController.getAllUsers);
router.get("/completed-levels", authenticate, usersController.getCompletedLevels);
router.get("/streaks", authenticate, usersController.getStreak);
// router.get(":id")

export default router;
