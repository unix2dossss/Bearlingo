import mongoose from "mongoose";
import UserProgress from "./UserProgress.js";
import JournalEntry from "./JournalEntry.js";
import CV from "./CV.js";
import InterviewPrepRecord from "./InterviewPrepRecord.js";
import CompanyResearch from "./CompanyResearch.js";

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
      type: String,
      default: null
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
        type: Date,
        default: null
      }
    },
    lastActiveProgress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProgress",
      default: null
    },
    progress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserProgress",
        default: []
      }
    ]
  },
  {
    timestamp: true
  }
);

// Delete associated data when user is deleted
userSchema.pre("deleteOne", { document: true, query: false }, async function(next) {
  const userId = this._id;
  await UserProgress.deleteMany({ user: userId });
  await JournalEntry.deleteMany({ user: userId });
  await CV.deleteMany({ userId });
  await InterviewPrepRecord.deleteMany({ user: userId });
  await CompanyResearch.deleteMany({ user: userId });
  next();
});


export default mongoose.model("User", userSchema);
