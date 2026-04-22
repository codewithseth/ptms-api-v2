import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route           GET /api/v1/users
// @description     Get all users
// @access          Private
router.get("/", protect, async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// @route           GET /api/v1/users/:id
// @description     Get a user by ID
// @access          Private
router.get("/:id", protect, async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// @route           POST /api/v1/users
// @description     Create a new user
// @access          Private
router.post("/", protect, async (req, res, next) => {
  const { username, password } = req.body || {}; // Add default empty object to prevent destructuring error

  if (!username || !password) {
    res.status(400);
    throw new Error("Username and password are required");
  }

  try {
    const newUser = await User.create(username, password);
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

// @route           PUT /api/v1/users/:id/username
// @description     Update a user's username
// @access          Private
router.put("/:id/username", protect, async (req, res, next) => {
  const { id } = req.params;
  const { newUsername } = req.body || {};

  if (!newUsername) {
    res.status(400);
    throw new Error("New username is required");
  }

  try {
    const updatedUser = await User.updateUsername(id, newUsername);
    if (updatedUser === 0) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json({ message: "Username updated successfully" });
  } catch (error) {
    next(error);
  }
});

// @route           PUT /api/v1/users/:id/password
// @description     Update a user's password
// @access          Private
router.put("/:id/password", protect, async (req, res, next) => {
  const { id } = req.params;
  const { newPassword } = req.body || {};

  if (!newPassword) {
    res.status(400);
    throw new Error("New password is required");
  }

  try {
    const updatedUser = await User.updatePassword(id, newPassword);
    if (updatedUser === 0) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
});

// @route           DELETE /api/v1/users/:id
// @description     Delete a user
// @access          Private
router.delete("/:id", protect, async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.delete(id);
    if (deletedUser === 0) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
