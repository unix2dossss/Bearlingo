import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      maxLength: 100,
      default: "Untitled Entry"
    },
    goals: {
      type: [
        {
          text: { type: String, required: true },
          done: { type: Boolean, default: false }
        }
      ],
      default: [{ text: "Update the LinkedIn", done: false }]
    },
    month: {
      type: Number,
      default: () => new Date().getMonth() + 1 // 1–12
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("JournalEntry", journalEntrySchema);