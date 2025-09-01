import mongoose from "mongoose";
import Module from "../models/Module.js";

export const getAllModules = async (req, res) => {
    try {
        const modules = await Module.find().populate('levels');
        res.status(200).json(modules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

