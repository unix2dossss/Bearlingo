import mongoose from "mongoose";
import Module from "../models/Module.js";
import Level from "../models/Level.js";

// Get all modules with their levels
export const getAllModules = async (req, res) => {
    try {
        const modules = await Module.find().populate('levels');
        res.status(200).json(modules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get subtasks by level ID
export const getSubtasksByLevelId = async (req, res) => {
    const levelId = req.params;

    if (!mongoose.Types.ObjectId.isValid(levelId)) {
        return res.status(400).json({ message: "Invalid level ID" });
    }
    try {
        const level = await Level.findById(levelId).populate('subtasks');
        if (!level) {
            return res.status(404).json({ message: "Level not found" });
        }
        res.status(200).json(level.subtasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

