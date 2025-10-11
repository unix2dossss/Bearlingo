import "dotenv/config";
import mongoose from "mongoose";

import Module from "../models/Module.js";
import Level from "../models/Level.js";
import Subtask from "../models/Subtask.js";

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to database!");

// Clear existing data (optional in real apps, but useful in dev/testing)
await Module.deleteMany({});
await Level.deleteMany({});
await Subtask.deleteMany({});
console.log("Cleared old data");

// -------------------
// Define initial data
// -------------------
const Modules = [
  {
    name: "CV Builder",
    description: "Get a professional CV to land your dream job.",
    levels: [] // will fill after levels are created
  },
  {
    name: "Interview Skills",
    description: "Get ready for your interviews.",
    levels: []
  },
  {
    name: "Networking Hub",
    description: "Connect with professionals.",
    levels: []
  }
];

// Create Modules first
const modules = await Module.insertMany(Modules);
console.log(`Inserted ${modules.length} modules`);

// Level 1 of each module
const Levels = [
  {
    title: "Basic CV creation",
    description: "Help you create a foundational CV",
    levelNumber: 1,
    module: modules[0]._id,
    xpReward: 50,
    badge: "silver badge",
    subtasks: []
  },
  {
    title: "Interview Preparation",
    description: "Equip you with basic interview knowledge.",
    levelNumber: 1,
    module: modules[1]._id,
    xpReward: 50,
    badge: "silver badge",
    subtasks: []
  },
  {
    title: "Building Your Network",
    description: "Help you start building a professional network.",
    levelNumber: 1,
    module: modules[2]._id,
    xpReward: 50,
    badge: "silver badge",
    subtasks: []
  }
];

// Insert Levels
const levels = await Level.insertMany(Levels);
console.log(`Inserted ${levels.length} levels`);

// Three subtasks for Level 1 of CV Builder
const cvBuilderLevel1Subtasks = [
  {
    title: "Personal & Education Details",
    description:
      "Start your CV by adding your personal and education details.\nYou can upload an existing PDF CV or fill the form to build one from scratch.",
    sequenceNumber: 1,
    level: levels[0]._id,
    xpReward: 20
  },
  {
    title: "Skills & Experience Checklist",
    description:
      "Show off your skills, projects, experience, and achievements.\nIf you uploaded a CV in Task 1, you can skip this step.",
    sequenceNumber: 2,
    level: levels[0]._id,
    xpReward: 20
  },
  {
    title: "Preview, download, and AI analyze",
    description:
      "Preview or download your CV, then let AI analyze it!\nGet instant feedback on strengths, weaknesses, and an overall score to see how your CV stands out.",

    sequenceNumber: 3,
    level: levels[0]._id,
    xpReward: 20
  }
];

// Three subtasks for Level 1 of Interview Skills
const interviewSkillsLevel1Subtasks = [
  {
    title: "Common Interview Questions",
    description: "Practice answering common interview questions.\nLearn how to introduce yourself, highlight strengths, and tackle tricky questions with confidence.",
    sequenceNumber: 1,
    level: levels[1]._id,
    xpReward: 20
  },
  {
    title: "Company Research Guide",
    description: "Research companies before interviews.\nFill in the company name, industry, key products, main competitors, and prepare questions to ask the interviewer. Impress employers and stand out!",
    sequenceNumber: 2,
    level: levels[1]._id,
    xpReward: 20
  },
  {
    title: "Reflection & Improvement",
    description: "Reflect on your interview practice.\nRecord what went well, what was difficult, and plan improvements to get better each time.",
    sequenceNumber: 3,
    level: levels[1]._id,
    xpReward: 20
  }
];

// Three subtasks for Level 1 of Networking Hub
const networkingHubLevel1Subtasks = [
  {
    title: "LinkedIn Profile Creation",
    description: "Create a LinkedIn profile with professional details.",
    sequenceNumber: 1,
    level: levels[2]._id,
    xpReward: 20
  },
  {
    title: "Connection Request Templates",
    description: "Provide templates for sending connection requests.",
    sequenceNumber: 2,
    level: levels[2]._id,
    xpReward: 20
  },
  {
    title: "Networking Event Calendar",
    description: "Implement a calendar of upcoming networking events.",
    sequenceNumber: 3,
    level: levels[2]._id,
    xpReward: 20
  }
];

// Combine all subtasks
const Subtasks = [].concat(
  cvBuilderLevel1Subtasks,
  interviewSkillsLevel1Subtasks,
  networkingHubLevel1Subtasks
);

// Insert Subtasks
const subtasks = await Subtask.insertMany(Subtasks);
console.log(`Inserted ${subtasks.length} subtasks`);

// -------------------
// Link subtasks -> levels
// -------------------
for (const level of levels) {
  const subtaskIds = subtasks
    .filter((s) => s.level.toString() === level._id.toString())
    .map((s) => s._id);

  level.subtasks = subtaskIds;
  await level.save();
}

// -------------------
// Link levels -> modules
// -------------------
for (const module of modules) {
  const levelIds = levels
    .filter((l) => l.module.toString() === module._id.toString())
    .map((l) => l._id);

  module.levels = levelIds;
  await module.save();
}

console.log("Database seeded successfully!");

// Disconnect when complete
await mongoose.disconnect();
console.log("Disconnected from database!");
