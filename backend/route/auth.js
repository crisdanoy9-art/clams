import { Router } from "express";
import { Login, Register } from "../controller/authController.js";

const authRouter = Router();

authRouter.post("/register", Register);
authRouter.post("/login", Login);

export default authRouter;
