import express from "express";

//controllers
import * as usersController from "../controllers/usersController.js";

//middlewares
import { authenticate } from "../middlewares/authMiddleware.js";
import { validateRegisterInputs, validateProfileUpdateInputs, handleValidationErrors } from "../middlewares/inputValidators.js";

const router = express.Router();

// ---------- Auth Routes ----------
router.post("/register", validateRegisterInputs, handleValidationErrors, usersController.registerUser);
router.post("/login", usersController.loginUser);
router.post("/logout", usersController.logoutUser);

// ---------- Profile Routes ----------
router.put("/profile", authenticate, validateProfileUpdateInputs, handleValidationErrors, usersController.updateUserProfile);

// ---------- User Management Routes ----------
router.get("/add", usersController.addUser);
router.get("/", usersController.getUserInfo);
router.delete("/", usersController.deleteUser);
router.get("/", authenticate, usersController.getAllUsers);

// ---------- Progress & Tracking Routes ----------
router.get("/completed-levels", authenticate, usersController.getCompletedLevels);
router.get("/streaks", usersController.getStreak);
router.get("/progress/module/:moduleId", authenticate, usersController.getUserModuleProgress);
router.get("/modules", authenticate, usersController.getModules);


// ---------- Journal Routes ----------
router.post("/journals", authenticate, usersController.createJournalEntry);
router.get("/journals", authenticate, usersController.getAllJournalEntries);
router.get("/journals/:year/:month", authenticate, usersController.getJournalsByMonth);
router.put("/journals/:id", authenticate, usersController.updateJournalEntry);

export default router;
