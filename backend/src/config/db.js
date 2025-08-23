import mongoose from "mongoose";
import Level from '../models/Level.js';
import Module from '../models/Level.js';
import Subtask from '../models/Level.js';



export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1); // Exit the process with failure
  }
};

const module1 = await Module.create({
  name: "CV Module",
  description: "Welcome to the CV Module! Here you will learn how to tailor your CV and stand out to hiring managers etc...."
})

console.log('Created First Module!:', module1);
