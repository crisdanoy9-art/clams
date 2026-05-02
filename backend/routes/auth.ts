import { Router } from "express";
import { Login, Register } from "../controller/authController";
import { upload } from "../middleware/upload";

const auth = Router();
auth.post("/login", Login);
auth.post("/register", upload.single("profile_img"), Register);

export default auth;
