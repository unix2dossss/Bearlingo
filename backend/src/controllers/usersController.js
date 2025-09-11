import User from "../models/User.js";
import UserProgress from "../models/UserProgress.js";
import JournalEntry from "../models/JournalEntry.js";
import Subtask from "../models/Subtask.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";
import { normalizeNames, formatDateAndMonth, updateUserStreak } from "../utils/helpers.js";
import mongoose from "mongoose";

// -------------------- Auth Controllers --------------------

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

    console.log("=====Body of request:  ", req.body, "=====");
    console.log("Hii this is running as expected in /registers");

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

// Logging in a user
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username }).select("+password");

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (isPasswordValid) {
      generateToken(res, existingUser._id);

      res.status(201).json({
        message: "Hello there - authorisation success!",
        user: {
          id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email
        }
      });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  } else {
    res.status(401).json({ message: "User not found" });
  }
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

// Getting a user's profile
export const getUserProfile = async (req, res) => {
  const id = req.user._id;
  // Check if id is valid
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const user = await User.findById(id);
  if (user === null) {
    return res.status(404).send(`User with id ${id} not found`);
  }
  return res.status(200).send({ message: "Succesful!", user: user });
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

      let updatedUser = await user.save();
      updatedUser = await User.findById(updatedUser._id).select("-password");

      res.json({
        message: "Profile updated successfully",
        user: updatedUser
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- User Management Controllers --------------------

// Deleting a user's account
export const deleteUser = async (req, res) => {
  const id = req.user._id;
  // Check if id is valid
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const user = await User.findById(id);
  if (user === null) {
    return res.status(404).send(`User with id ${id} not found`);
  }
  // triggers pre("deleteOne") hook in User model to delete every collection data associated with the user in the database
  await user.deleteOne();

  // Clear JWT cookie
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });
  return res.status(200).send({
    message: "User deleted successfully!",
    deletedUser: user
  });
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

// -------------------- Progress & Tracking Controllers --------------------

// Getting a user's progresses for all levels
export const getUserLevelProgresses = async (req, res) => {
  const id = req.user._id;
  // Check if id is valid
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  // Populate progress with Level info
  const user = await User.findById(id).populate({
    path: "progress",
    populate: {
      path: "levelProgress.level",
      model: "Level"
    }
  });
  if (user === null) {
    return res.status(404).send(`User with id ${id} not found`);
  }
  // Build object keyed by level number, Ex: { "Level 1": {...}, "Level 2": {...} }
  const AllLevelProgresses = {};
  user.progress.forEach((userProgress) => {
    const levelTitle = userProgress.levelProgress.level.title;
    AllLevelProgresses[`Level ${levelTitle}`] = userProgress;
  });
  if (Object.keys(AllLevelProgresses).length === 0) {
    return res.status(200).json({ message: "No level progresses found for this user" });
  }

  return res.status(200).json({
    message: "All level progresses for the user were successfully retrieved",
    AllLevelProgresses
  });
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
  const streak = user.streak;
  console.log(`Streak: ${streak}`);
  return res.status(200).json({
    message: "Streak retrieved successfully",
    streak: streak
  });
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
    // Find all UserProgress documents for the module
    const progressDocs = await UserProgress.find({
      user: userId,
      module: moduleId
    });
    if (!progressDocs.length) {
      return { moduleProgressPercentage: "0%" }; // No progress yet
    }
    // Add up all level progresses for the module
    let totalProgress = 0;
    for (const doc of progressDocs) {
      totalProgress += doc.levelProgress.progress;
    }
    const moduleProgressPercentage = progressDocs.length ? totalProgress / progressDocs.length : 0;
    return res.status(200).json({
      moduleProgressPercentage: moduleProgressPercentage + "%",
      levelProgresses: progressDocs
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Getting all modules of a user
export const getModules = async (req, res) => {
  const userId = req.user._id;
  // Check if id is valid
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const user = await User.findById(userId);
  // Checking is user is in database
  if (user === null) {
    return res.status(404).send(`User with id ${id} not found`);
  }
  const progressIds = user.progress; // Obtaining user's progress IDs
  const progressModules = await UserProgress.find({ _id: { $in: progressIds } }).populate("module"); // Retriving all of the modules of each progress id object
  const modules = progressModules.map((item) => item.module); // Only obtaining the module objects as an array
  return res.status(200).json({ modules: modules });
};

// Getting a module by ID
export const getModuleById = async (req, res) => {
  const userId = req.user._id;
  const moduleId = req.params.moduleId;
  // Validate IDs
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  if (!mongoose.isValidObjectId(moduleId)) {
    return res.status(400).json({ message: "Invalid module ID" });
  }
  // Get user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: `User with id ${userId} not found` });
  }
  const progressIds = user.progress; // Array of UserProgress IDs

  // Get module from user's progress
  const moduleProgress = await UserProgress.findOne({
    _id: { $in: progressIds },
    module: moduleId
  }).select("module"); // Retrieve all UserProgress documents with relevant ids for the User and then match it by the moduleID

  if (!moduleProgress) {
    return res.status(404).json({ message: `Module with id ${moduleId} not found for this user` });
  }
  return res.status(200).json(moduleProgress);
};

// Completing a subtask, updating progress and streak
export const completeSubtask = async (req, res) => {
  const userId = req.user._id;
  const subtaskId = req.params.subtaskId;

  if (!mongoose.isValidObjectId(subtaskId)) {
    return res.status(400).json({ message: "Invalid subtask ID" });
  }

  try {
    const subtask = await Subtask.findById(subtaskId).populate("level");
    if (!subtask)
      return res.status(404).json({ message: `Subtask with id ${subtaskId} not found` });

    const levelId = subtask.level;
    let userProgress = await UserProgress.findOne({
      user: userId,
      "levelProgress.level": levelId
    });

    let progressDocId;

    if (userProgress) {
      // Check if already completed
      const completedSubtasks = userProgress.levelProgress.completedSubtasks || [];
      if (completedSubtasks.includes(subtaskId)) {
        return res.status(400).json({ message: "Subtask already completed" });
      }

      // Update completed subtasks
      completedSubtasks.push(subtaskId);
      userProgress.levelProgress.completedSubtasks = completedSubtasks;

      // Update progress percentage
      const totalSubtasks = await Subtask.countDocuments({ level: levelId });
      userProgress.levelProgress.progress = Number(
        ((completedSubtasks.length / totalSubtasks) * 100).toFixed(2)
      );

      // Check badge
      userProgress.levelProgress.badgeEarned = completedSubtasks.length === totalSubtasks;

      await userProgress.save();
      progressDocId = userProgress._id;
    } else {
      // Create new UserProgress
      const newUserProgress = new UserProgress({
        user: userId,
        module: subtask.level.module,
        levelProgress: {
          level: levelId,
          completedSubtasks: [subtaskId],
          badgeEarned: false,
          progress: Number((100 / (await Subtask.countDocuments({ level: levelId }))).toFixed(2))
        }
      });
      await newUserProgress.save();
      progressDocId = newUserProgress._id;
      userProgress = newUserProgress;
    }

    // Update User document
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update user xp
    user.xp += subtask.xpReward || 0;
    if (userProgress.levelProgress.badgeEarned) {
      user.xp += subtask.level.xpReward; // Bonus XP for earning badge
    }

    // Update streak data of a user
    updateUserStreak(user);

    // Update lastActiveProgress
    user.lastActiveProgress = progressDocId;

    // Add to progress array if not already present
    if (!user.progress.includes(progressDocId)) {
      user.progress.push(progressDocId);
    }

    await user.save();

    return res.status(userProgress.isNew ? 201 : 200).json({
      message: "Well Done! You completed the subtask",
      userProgress
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- Journal Controllers --------------------

// Creating a new journal entry
export const createJournalEntry = async (req, res) => {
  const userId = req.user._id;
  let { title, goals } = req.body || {};
  // Trim title
  title = title?.trim();

  // Check that both title and at least one goal are provided
  if (!title && (!goals || goals.length === 0)) {
    return res
      .status(400)
      .json({ message: "Please add a title and at least one goal to save your journal." });
  }
  if (!title) {
    return res.status(400).json({ message: "Please give your journal a title before saving." });
  }

  if (!goals || goals.length === 0) {
    return res.status(400).json({ message: "Add at least one goal to save your journal." });
  }

  try {
    // Check if user already has a journal with the same title
    const existing = await JournalEntry.findOne({
      user: userId,
      title: title
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You already have a journal with this title. Try another one." });
    }

    const newEntry = new JournalEntry({
      user: userId,
      title,
      goals,
      month: new Date().getMonth() + 1, // 1-12
      date: new Date() // current date
    });
    const savedEntry = await newEntry.save();
    return res.status(201).json(savedEntry);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Getting a specific journal entry by ID
export const getJournalEntry = async (req, res) => {
  const userId = req.user._id;
  const journalId = req.params.id;

  // Validate journalId
  if (!mongoose.isValidObjectId(journalId)) {
    return res.status(400).json({ message: "Invalid journal ID" });
  }

  try {
    const journalEntry = await JournalEntry.findOne({
      _id: journalId,
      user: userId
    });
    if (!journalEntry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }
    // Format date + month
    const formattedDate = formatDateAndMonth(journalEntry.date);

    return res.status(200).json({
      ...journalEntry.toObject(),
      date: formattedDate.date,
      month: formattedDate.month
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Deleting a journal entry
export const deleteJournalEntry = async (req, res) => {
  const userId = req.user._id;
  const journalId = req.params.id;

  // Validate journalId
  if (!mongoose.isValidObjectId(journalId)) {
    return res.status(400).json({ message: "Invalid journal ID" });
  }

  try {
    const deletedEntry = await JournalEntry.findOneAndDelete({
      _id: journalId,
      user: userId
    });
    if (!deletedEntry) {
      return res.status(404).json({ message: "Journal entry not found or already deleted" });
    }
    return res.status(200).json({ message: "Journal entry deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Getting all journal entries for a user
export const getAllJournalEntries = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId, "_id firstName lastName username");
    const journalEntries = await JournalEntry.find({ user: userId }).sort({ createdAt: -1 }); // Sorting by most recent first
    if (!journalEntries.length) {
      return res.status(200).json({ message: "No journal entries found" });
    }
    return res.status(200).json({ user, journalEntries });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Getting all journals of a user by month
export const getJournalsByMonth = async (req, res) => {
  const userId = req.user._id;
  // Check if id is valid
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const user = await User.findById(userId);
  // Checking is user is in database
  if (user === null) {
    return res.status(404).send(`User with id ${userId} not found`);
  }
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month) - 1; // JS Date months are 0-indexed so Jan is 0
  const startDate = new Date(year, month, 1); // The format of the constructor is Date(year, month, day)
  const endDate = new Date(year, month + 1, 1);
  const journals = await JournalEntry.find({
    user: user,
    date: { $gte: startDate, $lt: endDate } // $gte is greater than or equal to startDate and $lt is less than the endDate
  }).sort({ createdAt: -1 }); // Sorting by most recent first

  if (journals.length === 0) {
    return res.status(200).json({ message: "No journal entries found for this month." });
  }
  return res.status(200).json(journals);
};

// Updating a journal entry
export const updateJournalEntry = async (req, res) => {
  const journalId = req.params.id;
  const updatedText = req.body;
  const updatedJournal = await JournalEntry.findByIdAndUpdate(
    journalId,
    updatedText,
    { new: true } // Ensures that the updated journal is returned
  );

  res.status(200).json(updatedJournal);
};

// -------------------- Leaderboard --------------------

// Getting the leaderboard
export const getLeaderboard = async (req, res) => {
  //const userId = req.user._id; Removed for now
  // Check if id is valid
  console.log("IN LEADERBOARD BACKEND ENDPOINT");
  /* if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  } */
  try {
    const users = await User.find({}, { username: 1, xp: 1, "streak.current": 1, linkedIn: 1 }) // Retrieving all users
      .sort({ xp: -1 }); // -1 for descending order. Sorting by xp

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error in leaderboard:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
