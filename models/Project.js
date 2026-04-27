import pool from "../config/db.js";

class Project {
  static async findAll(limit = 10, offset = 0) {
    try {
      const [projects] = await pool.query(
        "SELECT id, title, description, created_at FROM projects ORDER BY created_at DESC LIMIT ? OFFSET ?",
        [limit, offset],
      );
      const [[{ total }]] = await pool.query(
        "SELECT COUNT(*) as total FROM projects",
      );
      return { projects, total, limit, offset };
    } catch (error) {
      throw new Error(`Error fetching projects: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const [projects] = await pool.query(
        "SELECT id, title, description, created_at FROM projects WHERE id = ?",
        [id],
      );
      return projects[0];
    } catch (error) {
      throw new Error(`Error fetching project by ID: ${error.message}`);
    }
  }

  static async create(title, description) {
    try {
      const [result] = await pool.query(
        "INSERT INTO projects (title, description) VALUES (?, ?)",
        [title, description],
      );
      return {
        id: result.insertId,
        title,
        description,
        created_at: new Date(),
      };
    } catch (error) {
      throw new Error(`Error creating project: ${error.message}`);
    }
  }

  static async update(id, title, description) {
    try {
      const [result] = await pool.query(
        "UPDATE projects SET title = ?, description = ? WHERE id = ?",
        [title, description, id],
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating project: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query("DELETE FROM projects WHERE id = ?", [
        id,
      ]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error deleting project: ${error.message}`);
    }
  }
}

export default Project;
