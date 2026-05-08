import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
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

// Serve static files from public folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Routes
app.use("/auth", authRouter); // Accessible via /auth/login and /auth/register
app.use("/api", crudRouter); // Your protected CRUD routes

app.get("/", (req, res) => {
  res.send("CLAMS Server is running smoothly!");
});

app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});
