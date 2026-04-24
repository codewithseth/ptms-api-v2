import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

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
