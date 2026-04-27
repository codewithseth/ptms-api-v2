import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import dashboardStatsRouter from "./routes/dashboardStats.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://ptms-hazel.vercel.app",
// ];

// Middleware
app.use(cors({ origin: "https://ptms-hazel.vercel.app", credentials: true }));
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/dashboard-stats", dashboardStatsRouter);

// 404 Error Handling
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} - ${process.env.NODE_ENV} mode`,
  );
});
