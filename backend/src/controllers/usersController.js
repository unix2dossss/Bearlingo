import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";
import mongoose from "mongoose";

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, linkedIn } = req.body;

    // Normalize first and last names
    const formattedFirstName = normalizeNames(firstName);
    const formattedLastName = normalizeNames(lastName);

    // Hash the user password using bcrypt before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName: formattedFirstName,
      lastName: formattedLastName,
      username,
      email,
      password: hashedPassword,
      linkedIn
    });

    try {
      const savedUser = await newUser.save();
      generateToken(res, savedUser._id);
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: savedUser._id,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          username: savedUser.username,
          email: savedUser.email,
          linkedIn: savedUser.linkedIn
        }
      });
    } catch (error) {
      res.status(400).json({
        message: "User registration failed. Please check your details.",
        error: error.message
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Not fully implemented yet
export const loginUserToken = async (req, res) => {
  return res.send({ message: "Hello there - authorisation success!" });
};

export const getUserInfo = async (req, res) => {
  const id = req.params.id;
  // Check if id is valid
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const user = await User.findById(id);
  if (user === null) {
    return res.status(404).send(`User with id ${id} not found`);
  }
  return res.status(200).send(`Succesful! ${user}`);
};

// Deleting a user's account
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  // Check if id is valid
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const user = await User.deleteOne({ _id: id });
  if (user === null) {
    return res.status(404).send(`User with id ${id} not found`);
  }
  return res.status(200).send(`${user} Sucessfully delelted`);
};

export const addUser = async (req, res) => {
  const user = await User.create({
    firstName: "Alison",
    lastName: "Davidson",
    username: "ali123",
    email: "alison@gmail.com",
    password: "bearLingoI$C00l",
    streak: {
      lastActive: "2023-01-15T10:30:00Z",
      current: 10,
      longest: 10
    }
  });
  console.log("Created user:", user);
  return res.status(201).send(`${user} created!`);
};

export const getCompletedLevels = async (req, res) => {
  const id = req.params.id;
  // Check if id is valid
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const user = await User.findOne({ _id: id });
  if (user === null) {
    return res.status(404).send(`User with id ${id} not found`);
  }
  const progress = user.progress;
  console.log(`Progress: ${progress}`);
  return res.status(200).send(`${progress} sucessfully sent`);
};

export const getStreak = async (req, res) => {};


// ------ Helper functions ------ //

// Normalize names (handles multiple words, e.g., firstName: "Angel Milk")
const normalizeNames = (names) => {
  if (!names) return "";
  return names
    .split(/\s+/) // split by one or more spaces
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}