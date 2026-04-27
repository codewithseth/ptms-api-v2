import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/authMiddleware.js";
import Project from "../models/Project.js";

const router = express.Router();

// find all tasks
router.get("/", protect, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const {
      tasks,
      total,
      limit: pageSize,
      offset: pageOffset,
    } = await Task.findAll(limit, offset);
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: tasks,
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

// find task by id
router.get("/:id", protect, async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// create task
router.post("/", protect, async (req, res, next) => {
  const { project_id, title, description, status } = req.body || {};

  if (!project_id || !title) {
    res.status(400);
    throw new Error("Project ID and title are required");
  }

  const project = await Project.findById(project_id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  try {
    const newTask = await Task.create(
      project_id,
      title,
      description || "",
      status || "todo",
    );
    res.json(newTask);
  } catch (error) {
    next(error);
  }
});

// update task by id
router.put("/:id", protect, async (req, res, next) => {
  const { id } = req.params;
  const { title, description, status } = req.body || {};

  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  try {
    const updatedTask = await Task.update(
      id,
      title,
      description || "",
      status || "todo",
    );
    if (updatedTask === 0) {
      res.status(404);
      throw new Error("Task not found");
    }
    res.json({ message: "Task updated successfully" });
  } catch (error) {
    next(error);
  }
});

// delete task by id
router.delete("/:id", protect, async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.delete(id);
    if (deletedTask === 0) {
      res.status(404);
      throw new Error("Task not found");
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
