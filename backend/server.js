// backend/server.js - Make sure pool is imported
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import pool from "./db.js"; // MAKE SURE THIS EXISTS
import crudRouter from "./route/crud.js";
import authRouter from "./route/auth.js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Create 'public/uploads' if it doesn't exist
const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use("/public", express.static(path.join(__dirname, "public")));

// Routes
app.use("/auth", authRouter);
app.use("/api", crudRouter);

app.get("/", (req, res) => {
  res.send("CLAMS Server is running smoothly!");
});

app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});
