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

    // Check if username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "This username is already taken." });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "An account with this email already exists." });
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
      res
        .status(400)
        .json({
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
  const user = await User.findOne({ '_id': id });
  console.log("User: ", user);
  return res.send(`Succesful! ${user}`).sendStatus(201);
};



// export const getCompletedLevels = async(req, res) => {
  
// }

