// backend/controller/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsername, createUser } from "../model/authModel.js";
import { logActivity } from "../model/logsModel.js";
import pool from "../db.js";

const SALT_ROUNDS = 10;

export const Register = async (req, res) => {
  // ... unchanged
};

export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ msg: "Wrong password" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from .env file");
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    await logActivity(user.user_id, "LOGIN", "users", 1);

    return res.status(200).json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        id_number: user.id_number,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// New endpoint: get current user profile
export const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT user_id, id_number, username, first_name, last_name, email, role FROM clams.users WHERE user_id = $1 AND is_deleted = false",
      [req.user.user_id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// New endpoint: change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userResult = await pool.query(
      "SELECT password_hash FROM clams.users WHERE user_id = $1",
      [req.user.user_id],
    );
    if (userResult.rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    const valid = await bcrypt.compare(
      currentPassword,
      userResult.rows[0].password_hash,
    );
    if (!valid)
      return res.status(401).json({ error: "Current password is incorrect" });
    if (newPassword.length < 4)
      return res
        .status(400)
        .json({ error: "Password must be at least 4 characters" });
    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE clams.users SET password_hash = $1 WHERE user_id = $2",
      [newHash, req.user.user_id],
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
