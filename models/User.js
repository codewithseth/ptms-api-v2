import pool from "../config/db.js";
import bcrypt from "bcryptjs";

class User {
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

  static async matchPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error(`Error matching password: ${error.message}`);
    }
  }
}

export default User;
