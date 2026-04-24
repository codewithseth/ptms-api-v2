import express from "express";
import pool from "../config/db.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get dashboard statistics
router.get("/", protect, async (req, res) => {
  try {
    // Get total users count
    const [[{ totalUsers }]] = await pool.query(
      "SELECT COUNT(*) as totalUsers FROM users",
    );

    // Get total projects count
    const [[{ totalProjects }]] = await pool.query(
      "SELECT COUNT(*) as totalProjects FROM projects",
    );

    // Get total tasks and tasks by status
    const [[{ totalTasks, tasksDone, tasksInProgress, tasksTodo }]] =
      await pool.query(
        `SELECT 
          COUNT(*) as totalTasks,
          SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as tasksDone,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as tasksInProgress,
          SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as tasksTodo
        FROM tasks`,
      );

    res.json({
      totalUsers: totalUsers || 0,
      totalProjects: totalProjects || 0,
      totalTasks: totalTasks || 0,
      tasksDone: tasksDone || 0,
      tasksInProgress: tasksInProgress || 0,
      tasksTodo: tasksTodo || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
