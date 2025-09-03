import express from "express";

//middlewares
import { authenticate } from "../middlewares/authMiddleware.js";

//controllers
import * as modulesController from "../controllers/modulesController.js";

const router = express.Router();

router.get("/", authenticate, modulesController.getAllModules);
router.get("/level-subtasks/:levelId", authenticate, modulesController.getSubtasksByLevelId);
router.get("/subtasks/:subtaskId", authenticate, modulesController.getSubtaskById);

export default router;