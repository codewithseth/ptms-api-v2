import express from "express";
import Project from "../models/Project.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route           GET /api/v1/projects
// @description     Get all projects with pagination
// @access          Private
// @query           page - Page number (default: 1)
// @query           limit - Items per page (default: 10)
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

// @route           GET /api/v1/projects/:id
// @description     Get a project by ID
// @access          Private
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

// @route           POST /api/v1/projects
// @description     Create a new project
// @access          Private
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

// @route           PUT /api/v1/projects/:id
// @description     Update a project
// @access          Private
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

// @route           DELETE /api/v1/projects/:id
// @description     Delete a project
// @access          Private
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
