import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    linkedIn: {
      type: String
    },
    password: {
      type: String,
      required: true,
      select: false // Exclude password from queries by default
    },
    xp: {
      type: Number,
      default: 0
    },
    streak: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      },
      lastActive: {
        type: Date
      }
    },
    lastActiveProgress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProgress"
    },
    progress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserProgress"
      }
    ]
  },
  {
    timestamp: true
  }
);

export default mongoose.model("User", userSchema);
