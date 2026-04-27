import express from "express";
import User from "../models/User.js";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "../utils/getJwtSecret.js";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      res.status(400);
      throw new Error("Username and password are required");
    }

    // Find user
    const user = await User.findByUsername(username);

    if (!user) {
      res.status(401);
      throw new Error("Invalid Credentials");
    }

    // Check if password matches
    const isMatch = await User.matchPassword(password, user.pwd_hash);

    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid Credentials");
    }

    // Create Tokens
    const payload = { username: user.username, roles: user.roles };
    const accessToken = await generateToken(payload, "1m");
    const refreshToken = await generateToken(payload, "30d");

    // Set refresh token in HTTP-Only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: "/", // Ensure cookie is sent on all routes
    });

    res.status(201).json({
      accessToken,
      user: {
        username: user.username,
        roles: user.roles,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/", // Ensure cookie is cleared on all routes
  });

  res.status(200).json({ message: "Logged out successfully" });
});

router.post("/refresh", async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      res.status(401);
      throw new Error("No refresh token");
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    const user = await User.findByUsername(payload.username);

    if (!user) {
      res.status(401);
      throw new Error("No user");
    }

    const newAccessToken = await generateToken(
      { username: user.username, roles: user.roles },
      "1m",
    );

    res.json({
      accessToken: newAccessToken,
      user: {
        username: user.username,
        roles: user.roles,
      },
    });
  } catch (err) {
    res.status(401);
    next(err);
  }
});

export default router;
