import mongoose from "mongoose";

const CompanyResearchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    companyName: {
      type: String,
      required: true
    },
    industry: {
      type: String,
      required: true
    },
    products: {
      type: String,
      required: true
    },
    competitors: {
      type: String,
      required: true
    },
    questions: [
      {
        type: String,
        required: true
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("CompanyResearch", CompanyResearchSchema);
