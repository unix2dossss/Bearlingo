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
    trim: true,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  contact: {
    phone: {
      type: String,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    linkedin: {
      type: String,
      maxlength: 200,
    },
  },

  // Education
  education: {
    secondary: {
      schoolName: { type: String, maxlength: 100 },
      subjects: [{ type: String, maxlength: 50 }],
      achievements: [{ type: String, maxlength: 100 }],
      startYear: { type: String, maxlength: 4 },
      endYear: { type: String, maxlength: 10 }, 
    },
    tertiary: [
      {
        university: { type: String, maxlength: 100 },
        degree: { type: String, maxlength: 100 },
        startYear: { type: String, maxlength: 4 },
        endYear: { type: String, maxlength: 10 }, // "Present" or year
      },
    ],
  },

  // About Me
  about: {
    type: String,
    maxlength: 500, // keep it short, ~1 paragraph
  },

  // Skills (up to 8, short keywords only)
  skills: {
    type: [String],
    maxlength: 8
},

  // Projects (up to 3)
  projects: [
    {
      name: { type: String, required: true, maxlength: 100 },
      outcome: { type: String, required: true, maxlength: 250 }, // ~2 sentences
      roleContribution: { type: String, required: true, maxlength: 250 }, // ~2–3 sentences
      link: { type: String, maxlength: 200 },
    },
  ],

  // Work Experiences (up to 3)
  experiences: [
    {
      company: { type: String, required: true, maxlength: 100 },
      role: { type: String, required: true, maxlength: 100 },
      startYear: { type: String, required: true, maxlength: 4 },
      endYear: { type: String, required: true, maxlength: 10 }, // allow "Present"
      contribution: { type: String, required: true, maxlength: 250 }, // ~2–3 sentences
    },
  ],
});

const CV = mongoose.model("CV", cvSchema);

export default CV;
