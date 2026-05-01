// controllers/authController.ts
import { Request, Response } from "express";
import { findUser, createUser } from "../model/authQueries";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const Login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await findUser(username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" },
    );

    return res.status(200).json({
      msg: `successfully login with the username ${user.username}`,
      token,
      role: user.role,
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
};

export const Register = async (req: Request, res: Response) => {
  try {
    console.log("Register body:", req.body);
    console.log("DB config:", {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
    });

    const { username, password, ...rest } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const existing = await findUser(username);
    if (existing) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await createUser({ ...rest, username, password_hash });

    return res.status(201).json({ message: "User registered", data: newUser });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
};
