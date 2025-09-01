import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import usersRoutes from "./routes/usersRoutes.js";
import modulesRoutes from "./routes/modulesRoutes.js";
import cors from "cors";
import morgan from "morgan";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse form data into a JavaScript object and store it in req.body
app.use(cookieParser()); // Parse req.cookies into a JSON object
app.use(cors()); // uses cors middleware package,  any frontend on any domain can access your API
// Logging info with morgan middleware
app.use(morgan("dev"));


// Routes
app.get('/test', (req, res) => {
  res.send('Server is working!');
});
app.use("/api/users", usersRoutes);
app.use("/api/modules", modulesRoutes);

// Connect to MongoDB and start the server
console.log("Connecting to MongoDB: ", process.env.MONGO_URI);
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Server is running on: http://localhost:" + PORT);
  });
});
