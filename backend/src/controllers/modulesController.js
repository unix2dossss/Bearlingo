import mongoose from "mongoose";
import Module from "../models/Module.js";
import Level from "../models/Level.js";
import Subtask from "../models/Subtask.js";

// Getting all modules with their levels
export const getAllModules = async (req, res) => {
  try {
    const modules = await Module.find().populate("levels");

    // Transform the array into an object with module names as keys and module data as values
    const modulesByName = {};
    for (const module of modules) {
      modulesByName[module.name] = module;
    }

    res.status(200).json(modulesByName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Getting subtasks by level ID
export const getSubtasksByLevelId = async (req, res) => {
  const levelId = req.params.levelId;

  if (!mongoose.Types.ObjectId.isValid(levelId)) {
    return res.status(400).json({ message: "Invalid level ID" });
  }
  try {
    const level = await Level.findById(levelId).populate("subtasks");
    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }
    // Transform subtasks array into object with titles as keys
    const subtasksByTitle = {};
    for (const subtask of level.subtasks) {
      subtasksByTitle[subtask.title] = subtask;
    }
    res.status(200).json(subtasksByTitle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Getting a subtask by id
export const getSubtaskById = async (req, res) => {
  const subtaskId = req.params.subtaskId;
  // Validate subtaskId
  if (!mongoose.isValidObjectId(subtaskId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  // Retrieve the subtask by Id
  const subtask = await Subtask.findById(subtaskId);
  if (!subtask) {
    return res.status(404).json({ message: `Subtask with id ${subtaskId} not found` });
  }
  return res.status(200).json(subtask);
};
