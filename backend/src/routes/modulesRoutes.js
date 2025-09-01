import express from "express";

//controllers
import * as modulesController from "../controllers/modulesController.js";

const router = express.Router();

router.get("/", modulesController.getAllModules);
router.get("/level-subtasks/:levelId", modulesController.getSubtasksByLevelId);

export default router;