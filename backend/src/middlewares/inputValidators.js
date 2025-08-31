import { body, validationResult } from "express-validator";
import User from "../models/User.js";

// Reusable validator for names (firstName, lastName)
const nameValidator = (field) => {
  return body(field)
    .trim()
    .notEmpty()
    .withMessage("Please fill all the fields.")
    .bail()
    .isAlpha("en-US", { ignore: " " })
    .withMessage(`${field} can only contain letters.`)
    .isLength({ min: 2, max: 30 })
    .withMessage(`${field} must be between 2 and 30 characters.`);
};

const usernameValidator = body("username")
  .trim()
  .notEmpty()
  .withMessage("Please fill all the fields.")
  .bail()
  .isLength({ min: 3, max: 20 })
  .withMessage("Username must be 3–20 characters long.")
  .matches(/^[a-zA-Z0-9_]+$/)
  .withMessage("Username can only contain letters, numbers, and underscores.")
  .custom(async (value) => {
    // Check if username already exists in the database
    const usernameExists = await User.findOne({ username: value });
    if (usernameExists) {
      throw new Error("This username is already taken.");
    }
  });

const emailValidator = body("email")
  .trim()
  .notEmpty()
  .withMessage("Please fill all the fields.")
  .bail()
  .isEmail()
  .withMessage("Please provide a valid email address.")
  .normalizeEmail()
  .custom(async (value) => {
    // Check if email already exists in the database
    const emailExists = await User.findOne({ email: value });
    if (emailExists) {
      throw new Error("An account with this email already exists.");
    }
  });

const passwordValidator = body("password")
  .trim()
  .notEmpty()
  .withMessage("Please fill all the fields.")
  .bail()
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long.")
  .matches(/[a-z]/)
  .withMessage("Password must contain at least one lowercase letter.")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter.");

const confirmPasswordValidator = body("confirmPassword")
  .trim()
  .notEmpty()
  .withMessage("Please fill all the fields.")
  .bail()
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match.");
    }
    return true;
  });

const linkedInValidator = body("linkedIn")
  .optional()
  .trim()
  .isURL()
  .withMessage("Please provide a valid URL.")
  .bail()
  .matches(/^((https?:\/\/)?(www\.)?linkedin\.com\/.*)$/)
  .withMessage("Please enter a valid LinkedIn URL (e.g., https://www.linkedin.com/in/username).");


