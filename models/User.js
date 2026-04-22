import pool from "../config/db.js";
import bcrypt from "bcryptjs";

class User {
  // Fetch all users (excluding password hashes)
  static async findAll() {
    try {
      const [users] = await pool.query(
        "SELECT id, username FROM users ORDER BY created_at DESC",
      );
      return users;
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  // Fetch a user by ID (excluding password hash)
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

  // Fetch a user by username (including password hash for authentication)
  static async findByUsername(username) {
    try {
      const [users] = await pool.query(
        "SELECT id, username, pwd_hash FROM users WHERE username = ?",
        [username],
      );
      return users[0];
    } catch (error) {
      throw new Error(`Error fetching user by username: ${error.message}`);
    }
  }

  // Create a new user with hashed password
  static async create(username, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        "INSERT INTO users (username, pwd_hash) VALUES (?, ?)",
        [username, hashedPassword],
      );
      return {
        id: result.insertId,
        username,
      };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Update a user's username
  static async updateUsername(id, newUsername) {
    try {
      const [result] = await pool.query(
        "UPDATE users SET username = ? WHERE id = ?",
        [newUsername, id],
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating username: ${error.message}`);
    }
  }

  // Update a user's password
  static async updatePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const [result] = await pool.query(
        "UPDATE users SET pwd_hash = ? WHERE id = ?",
        [hashedPassword, id],
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating password: ${error.message}`);
    }
  }

  // Delete a user by ID
  static async delete(id) {
    try {
      const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error(`Error verifying password: ${error.message}`);
    }
  }
}

export default User;
