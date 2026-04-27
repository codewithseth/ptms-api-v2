import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// find all users
router.get("/", protect, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const {
      users,
      total,
      limit: pageSize,
      offset: pageOffset,
    } = await User.findAll(limit, offset);
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: users,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
});

// find user by id
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

// create user
router.post("/", protect, async (req, res, next) => {
  const { username, password, roles = "Developer" } = req.body || {};

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

// update user by id
router.put("/:id", protect, async (req, res, next) => {
  const { id } = req.params;
  const { username, password, roles } = req.body || {};

  if (!username && !password && !roles) {
    res.status(400);
    throw new Error(
      "At least one field (username, password, roles) is required",
    );
  }

  try {
    const updatedUser = await User.update(id, { username, password, roles });
    if (!updatedUser) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json({ message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
});

// delete user by id
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
