import mongoose from "mongoose";

const InterviewPrepRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    companyResearches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyResearch"
      }
    ],

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
