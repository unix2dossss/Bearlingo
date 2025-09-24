import express from "express";

//controllers
import * as usersController from "../controllers/usersController.js";

//middlewares
import { authenticate } from "../middlewares/authMiddleware.js";
import { validateRegisterInputs, validateLoginInputs, validateProfileUpdateInputs, handleValidationErrors } from "../middlewares/inputValidators.js";

const router = express.Router();

// ---------- Auth Routes ----------
router.post("/register", validateRegisterInputs, handleValidationErrors, usersController.registerUser);
router.post("/login", validateLoginInputs, handleValidationErrors, usersController.loginUser);
router.post("/logout", usersController.logoutUser);

// ---------- Profile Routes ----------
router.get("/profile", authenticate, usersController.getUserProfile);
router.put("/profile", authenticate, validateProfileUpdateInputs, handleValidationErrors, usersController.updateUserProfile);

// ---------- User Management Routes ----------
router.get("/add", usersController.addUser);
router.delete("/", authenticate, usersController.deleteUser);
router.get("/", authenticate, usersController.getAllUsers);

// ---------- Progress & Tracking Routes ----------
router.get("/progress/levels", authenticate, usersController.getUserLevelProgresses);
router.get("/streaks", authenticate, usersController.getStreak);
router.get("/progress/module/:moduleId", authenticate, usersController.getUserModuleProgress);
router.get("/modules", authenticate, usersController.getModules);
router.get("/modules/:moduleId", authenticate, usersController.getModuleById);
router.post("/complete/level-subtasks/:subtaskId", authenticate, usersController.completeSubtask);


// ---------- Journal Routes ----------
router.post("/journals", authenticate, usersController.createJournalEntry);
router.get("/journals/:id", authenticate, usersController.getJournalEntry);
router.delete("/journals/:id", authenticate, usersController.deleteJournalEntry);
router.get("/journals", authenticate, usersController.getAllJournalEntries);
router.get("/journals/:year/:month", authenticate, usersController.getJournalsByMonth);
router.put("/journals/:id", authenticate, usersController.updateJournalEntry);

// -- New Journal - Goals Routes --
router.post("/goals", authenticate, usersController.createGoal);
router.get("/goals", authenticate, usersController.getGoals);

// -- New Journal - Reflections Routes --
router.post("/reflections", authenticate, usersController.createReflection);
router.get("/reflections", authenticate, usersController.getReflections);

// -- New Journal - Notes Routes --
router.post("/notes", authenticate, usersController.createNote);
router.get("/notes", authenticate, usersController.getNotes);


// ---------- Leaderboard Routes ----------
router.get("/leaderboard", usersController.getLeaderboard); // For the time being I will get rud of authenticate middleware as not all of the components have been made yet

export default router;
