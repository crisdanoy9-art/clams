import { Router } from "express";
import { Login, Register } from "../controller/authController";

const auth = Router();
auth.post("/login", Login);
auth.post("/register", Register);

export default auth;
