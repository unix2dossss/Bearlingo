import mongoose from "mongoose";

const cvSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Each CV must belong to a user
  },

  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    phone: {
      type: String,
      trim: true,
      maxlength: 11,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    linkedin: {
      type: String
    },
  },

  // Education
  education: {
    secondary: {
      schoolName: { type: String },
      subjects: [{ type: String }],
      achievements: [{ type: String }],
      startYear: { type: String },
      endYear: { type: String }, 
    },
    tertiary: [
      {
        university: { type: String },
        degree: { type: String },
        startYear: { type: String },
        endYear: { type: String }, // "Present" or year
      },
    ],
  },

  // About Me
  aboutMe: {
    type: String
  },

  // Skills (up to 8, short keywords only)
  skills: {
    type: [String]
},

  // Projects (up to 3)
  projects: [
    {
      name: { type: String, required: true },
      outcome: { type: String, required: true }, // ~2 sentences
      roleContribution: { type: String, required: true }, // ~2–3 sentences
      link: { type: String },
    },
  ],

  // Work Experiences (up to 3)
  experiences: [
    {
      company: { type: String, required: true },
      role: { type: String, required: true },
      startYear: { type: String, required: true },
      endYear: { type: String, required: true }, // allow "Present"
      contribution: { type: String, required: true }, // ~2–3 sentences
    },
  ],
});

const CV = mongoose.model("CV", cvSchema);

export default CV;
