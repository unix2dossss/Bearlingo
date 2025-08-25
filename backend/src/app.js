import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Routes

// Connect to MongoDB and start the server
console.log("Connecting to MongoDB: ", process.env.MONGO_URI);
connectDB().then(() => {

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Server is running on: http://localhost:" + PORT);
  });
});
