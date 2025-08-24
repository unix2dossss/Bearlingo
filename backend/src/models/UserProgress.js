import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true
    },
    levelProgress: {
      level: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Level",
        required: true
      },
      completedSubtasks: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subtask",
          required: true
        }
      ],
      badgeEarned: {
        type: Boolean,
        default: false
      },
      progress: {
        type: Number
      }
    }
  },
  {
    timestamp: {
      type: Date,
      default: Date.now
    }
  }
);

export default mongoose.model("UserProgress", userProgressSchema);
