// backend/controller/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsername, createUser } from "../model/authModel.js";
import { logActivity } from "../model/logsModel.js";

const SALT_ROUNDS = 10;

export const Register = async (req, res) => {
  try {
    const {
      id_number,
      username,
      password,
      first_name,
      last_name,
      email,
      role,
    } = req.body;

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await createUser({
      id_number,
      username,
      password_hash,
      first_name,
      last_name,
      email,
      role,
    });

    return res
      .status(201)
      .json({ msg: "User registered successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
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

    // Log the login action (record_id = 1 for admin user)
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
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
