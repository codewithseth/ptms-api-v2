import pool from "../config/db.js";

class Project {
  // Fetch all projects
  static async findAll() {
    try {
      const [projects] = await pool.query(
        "SELECT id, title, description, created_at FROM projects ORDER BY created_at DESC",
      );
      return projects;
    } catch (error) {
      throw new Error(`Error fetching projects: ${error.message}`);
    }
  }

  // Fetch a project by ID
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

  // Create a new project
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

  // Update a project
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

  // Delete a project
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
