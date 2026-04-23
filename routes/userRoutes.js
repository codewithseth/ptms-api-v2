import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/", protect, async (req, res, next) => {
  const { username, password, roles = "USER" } = req.body || {};

  if (!username || !password) {
    res.status(400);
    throw new Error("Username and password are required");
  }

  try {
    const newUser = await User.create({ username, password, roles });
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

export default router;
