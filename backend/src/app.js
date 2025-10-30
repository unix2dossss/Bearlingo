import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import usersRoutes from "./routes/usersRoutes.js";
import modulesRoutes from "./routes/modulesRoutes.js";
import cvRoutes from "./routes/cvRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import networkingRoutes from "./routes/networkingRoutes.js";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";

// Passport configuration
import "./config/passport.js";
// import "./models/User.js";

const app = express();
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://bearlingo-theta.vercel.app" // deployed frontend
];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse form data into a JavaScript object and store it in req.body
app.use(cookieParser()); // Parse req.cookies into a JSON object
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
); // uses cors middleware package,  any frontend on any domain can access your API
// Logging info with morgan middleware
app.use(morgan("dev"));

// Passport middleware
app.use(passport.initialize());

// Routes
app.get("/test", (req, res) => {
  res.send("Server is working!");
});
app.use("/api/users", usersRoutes);
app.use("/api/users/me/cv", cvRoutes);
app.use("/api/users/me/interview", interviewRoutes);
app.use("/api/modules", modulesRoutes);
app.use("/api/users/me/networking", networkingRoutes);

// Connect to MongoDB and start the server
console.log("Connecting to MongoDB: ", process.env.MONGO_URI);
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Server is running on: http://localhost:" + PORT);
  });
});
