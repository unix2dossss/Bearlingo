import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

/*
Register the routes
Examples:
    app.use("/api/users", usersRoutes);
    app.use("/api/journals", journalsRoutes);
*/

// Connect to MongoDB
console.log("Connecting to MongoDB: ", process.env.MONGO_URI);
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on: http://localhost:" + PORT);
});
