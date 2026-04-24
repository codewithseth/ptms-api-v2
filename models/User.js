import pool from "../config/db.js";
import bcrypt from "bcryptjs";

class User {
  static async findAll(limit = 10, offset = 0) {
    try {
      const [users] = await pool.query(
        "SELECT id, username, roles, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?",
        [limit, offset],
      );
      const [[{ total }]] = await pool.query(
        "SELECT COUNT(*) as total FROM users",
      );
      return { users, total, limit, offset };
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const [users] = await pool.query(
        "SELECT id, username FROM users WHERE id = ?",
        [id],
      );
      return users[0];
    } catch (error) {
      throw new Error(`Error fetching user by ID: ${error.message}`);
    }
  }

  static async create(user) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const [result] = await pool.query(
        "INSERT INTO users (username, pwd_hash, roles) VALUES (?, ?, ?)",
        [user.username, hashedPassword, user.roles],
      );
      return {
        id: result.insertId,
        username: user.username,
        roles: user.roles,
        created_at: new Date(),
      };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  static async update(id, user) {
    try {
      const fields = [];
      const values = [];

      if (user.username) {
        fields.push("username = ?");
        values.push(user.username);
      }
      if (user.password) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        fields.push("pwd_hash = ?");
        values.push(hashedPassword);
      }
      if (user.roles) {
        fields.push("roles = ?");
        values.push(user.roles);
      }
      if (fields.length === 0) {
        throw new Error("No fields to update");
      }

      values.push(id);

      const [result] = await pool.query(
        `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
        values,
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  static async findByUsername(username) {
    try {
      const [users] = await pool.query(
        "SELECT username, pwd_hash, roles FROM users WHERE username = ?",
        [username],
      );
      return users[0];
    } catch (error) {
      throw new Error(`Error fetching user by username: ${error.message}`);
    }
  }

  static async matchPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error(`Error matching password: ${error.message}`);
    }
  }
}

export default User;
