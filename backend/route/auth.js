// backend/route/auth.js
import { Router } from "express";
import { Login, Register } from "../controller/authController.js";

const router = Router();

// Public routes (no token needed)
router.post("/login", Login);
router.post("/register", Register);

export default router;
