import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, username, email, linkedIn, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Additional validation (e.g., email format, password strength)

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the user password using bcrypt before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      linkedIn,
      password: hashedPassword
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
      res.status(400).json({ message: "User registration failed. Please check your details.", error: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
