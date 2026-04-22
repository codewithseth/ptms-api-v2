import pool from "../config/db.js";

class Task {
  // Fetch all tasks
  static async findAll() {
    try {
      const [tasks] = await pool.query(
        "SELECT id, project_id, title, description, status, created_at FROM tasks ORDER BY created_at DESC",
      );
      return tasks;
    } catch (error) {
      throw new Error(`Error fetching tasks: ${error.message}`);
    }
  }

  // Fetch tasks by project ID
  static async findByProjectId(project_id) {
    try {
      const [tasks] = await pool.query(
        "SELECT id, project_id, title, description, status, created_at FROM tasks WHERE project_id = ? ORDER BY created_at DESC",
        [project_id],
      );
      return tasks;
    } catch (error) {
      throw new Error(`Error fetching tasks by project ID: ${error.message}`);
    }
  }

  // Fetch a task by ID
  static async findById(id) {
    try {
      const [tasks] = await pool.query(
        "SELECT id, project_id, title, description, status, created_at FROM tasks WHERE id = ?",
        [id],
      );
      return tasks[0];
    } catch (error) {
      throw new Error(`Error fetching task by ID: ${error.message}`);
    }
  }

  // Create a new task
  static async create(project_id, title, description, status) {
    try {
      const [result] = await pool.query(
        "INSERT INTO tasks (project_id, title, description, status) VALUES (?, ?, ?, ?)",
        [project_id, title, description, status || "todo"],
      );
      return {
        id: result.insertId,
        project_id,
        title,
        description,
        status: status || "todo",
        created_at: new Date(),
      };
    } catch (error) {
      throw new Error(`Error creating task: ${error.message}`);
    }
  }

  // Update a task
  static async update(id, title, description, status) {
    try {
      const [result] = await pool.query(
        "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?",
        [title, description, status, id],
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating task: ${error.message}`);
    }
  }

  // Delete a task
  static async delete(id) {
    try {
      const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error deleting task: ${error.message}`);
    }
  }
}

export default Task;
