import express from "express";
import Project from "../models/Project.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// find all projects
router.get("/", protect, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const {
      projects,
      total,
      limit: pageSize,
      offset: pageOffset,
    } = await Project.findAll(limit, offset);
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: projects,
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

// find project by id
router.get("/:id", protect, async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
});

// create project
router.post("/", protect, async (req, res, next) => {
  const { title, description } = req.body || {};

  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  try {
    const newProject = await Project.create(title, description || "");
    res.json(newProject);
  } catch (error) {
    next(error);
  }
});

// update project by id
router.put("/:id", protect, async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body || {};

  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  try {
    const updatedProject = await Project.update(id, title, description || "");
    if (updatedProject === 0) {
      res.status(404);
      throw new Error("Project not found");
    }
    res.json({ message: "Project updated successfully" });
  } catch (error) {
    next(error);
  }
});

// delete project by id
router.delete("/:id", protect, async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedProject = await Project.delete(id);
    if (deletedProject === 0) {
      res.status(404);
      throw new Error("Project not found");
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
