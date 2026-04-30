import pool from "../config/db.js";

class Task {
  static async findAll(limit = 10, offset = 0) {
    try {
      const [tasks] = await pool.query(
        "SELECT t.*, p.title AS project_name FROM tasks t JOIN projects p ON t.project_id = p.id ORDER BY t.created_at DESC LIMIT ? OFFSET ?;",
        [limit, offset],
      );
      const [countResult] = await pool.query(
        "SELECT COUNT(*) as total FROM tasks",
      );
      const total = countResult[0].total;
      return { tasks, total, limit, offset };
    } catch (error) {
      throw new Error(`Error fetching tasks: ${error.message}`);
    }
  }

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
