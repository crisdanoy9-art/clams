import { Router } from "express";
import {
  Login,
  Register,
  getMe,
  changePassword,
} from "../controller/authController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/login", Login);
router.post("/register", Register);
router.get("/me", verifyToken, getMe);
router.post("/change-password", verifyToken, changePassword);

export default router;
