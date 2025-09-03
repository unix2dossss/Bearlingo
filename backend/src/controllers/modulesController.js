import mongoose from "mongoose";
import Module from "../models/Module.js";
import Level from "../models/Level.js";
import Subtask from "../models/Subtask.js";

// Getting all modules with their levels
export const getAllModules = async (req, res) => {
  try {
    const modules = await Module.find().populate("levels");
    return res.status(200).json(modules);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
    // Sort subtasks by sequenceNumber
    const subtasks = level.subtasks.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    return res.status(200).json(subtasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
