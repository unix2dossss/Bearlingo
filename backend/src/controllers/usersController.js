import User from "../models/User.js";
import UserProgress from "../models/UserProgress.js";
import JournalEntry from "../models/JournalEntry.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";
import mongoose from "mongoose";

// ---------- Auth Controllers ----------

// Registering a new user
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
export const loginUser = async (req, res) => {
  return res.send({ message: "Hello there - authorisation success!" });
};

export const getUserInfo = async (req, res) => {
  const id = req.user._id;
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

// Logging out a user
export const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0), // Set the cookie to expire immediately
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Updating a user's profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = normalizeNames(req.body.firstName) || user.firstName;
      user.lastName = normalizeNames(req.body.lastName) || user.lastName;
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.linkedIn = req.body.linkedIn || user.linkedIn;

      // Updating password
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        email: updatedUser.email,
        linkedIn: updatedUser.linkedIn
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------- User Management Controllers ----------

// Deleting a user's account
export const deleteUser = async (req, res) => {
  const id = req.user._id;
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

// Adding a user (for testing purposes)
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

// Getting all users
export const getAllUsers = async (_, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------- Progress & Tracking Controllers ----------

// Getting a user's completed levels
export const getCompletedLevels = async (req, res) => {
  const id = req.user._id;
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

// Getting user's streak
export const getStreak = async (req, res) => {
  const id = req.user._id;
  // Check if id is valid
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const user = await User.findOne({ _id: id });
  if (user === null) {
    return res.status(404).send(`User with id ${id} not found`);
  }
  const progress = user.streaks;
  console.log(`Progress: ${progress}`);
  return res.status(200).send(`${progress} sucessfully sent`);
};

// Getting a user's progress in a specific module
export const getUserModuleProgress = async (req, res) => {
  const userId = req.user._id; // Authenticated user's ID
  const moduleId = req.params.moduleId;

  // Validate moduleId
  if (!mongoose.isValidObjectId(moduleId)) {
    return res.status(400).json({ message: "Invalid module ID" });
  }
  try {
    const progressDocs = await UserProgress.find({
      user: userId,
      module: moduleId
    });
    if (!progressDocs.length) {
      return { moduleProgress: 0 }; // No progress yet
    }
    // Add up all level progresses for the module
    let totalProgress = 0;
    for (const doc of progressDocs) {
      totalProgress += doc.levelProgress.progress;
    }
    const moduleProgress = progressDocs.length ? total / progressDocs.length : 0;
    return res.status(200).json({ "User module progress": moduleProgress });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------- Journal Controllers ----------

// Creating a new journal entry
export const createJournalEntry = async (req, res) => {
  const userId = req.user._id;
  const { title, goals } = req.body || {};

  // Check that at least one is provided
  if ((!title || title.trim() === "") && (!goals || goals.length === 0)) {
    return res.status(400).json({ message: "Add a title or a goal to save." });
  }
  try {
    const newEntry = new JournalEntry({
      user: userId,
      title: title?.trim(), // will use schema default if undefined
      goals: goals, // will use schema default if undefined
      month: new Date().getMonth() + 1, // 1-12
      date: new Date() // current date
    });
    const savedEntry = await newEntry.save();
    return res.status(201).json(savedEntry);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Getting all journal entries for a user
export const getAllJournalEntries = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId, "_id firstName lastName username");
    const journalEntries = await JournalEntry.find({ user: userId });
    if (!journalEntries.length) {
      return res.status(200).json({ message: "No journal entries found" });
    }
    return res.status(200).json({ user, journalEntries });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Getting journals by month
export const getJournalsByMonth = async (req, res) => {
  const userId = req.user._id;
  // Check if id is valid
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const user = await User.findById(userId);
  // Checking is user is in database
  if (user === null) {
    return res.status(404).send(`User with id ${id} not found`);
  }
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month) - 1; // JS Date months are 0-indexed so Jan is 0
  const startOfMonth = new Date(year, month, 1); // The format of the constructor is Date(year, month, day)
  const endOfMonth = new Date(year, month + 1, 1);
  const journals = await JournalEntry.find({
    "user": user,
    date: { $gte: startDate, $lt: endDate } // $gte is greater than or equal to startDate and $lt is less than the endDate
  });
  res.status(200).json(journals);
}


// Update a journal entry
export const updateJournalEntry = async (req, res) => {
  const journalId = req.params.id;
  const updatedText = req.body;
  const updatedJounral = await JournalEntry.findByIdAndUpdate(
    journalId,
    updatedText,
    { new: true } // Ensures that the updated journal is returned
  );

  res.status(200).json(updatedJournal);
}


// ------ Helper functions ------ //

// Normalize names (handles multiple words, e.g., firstName: "AnGel MILk" -> "Angel Milk")
const normalizeNames = (names) => {
  if (!names) return "";
  return names
    .split(/\s+/) // split by one or more spaces
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
