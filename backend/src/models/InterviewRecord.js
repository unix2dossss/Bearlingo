import mongoose from "mongoose";

const InterviewPrepRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    companyResearch: {
      companyName: { type: String, required: true },
      industry: { type: String, required: true },
      products: { type: String, required: true },
      competitors: { type: String, required: true },
      questions: [{ type: String, required: true }] // questions to ask interviewer
    },

    reflection: {
      whatWentWell: { type: String, required: true },
      whatWasDifficult: { type: String, required: true },
      improvementPlan: { type: String, required: true }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("InterviewPrepRecord", InterviewPrepRecordSchema);
