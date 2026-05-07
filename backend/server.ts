import express, { Request, Response } from "express";
import auth from "./routes/auth";
import crud from "./routes/crud";
import fs from "fs";
import path from "path";
import { verifyToken } from "./middleware/jwt";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // add this too

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
// Mount the router
app.use("/users", auth);
app.use("/api", crud);

// Protected file retrieval
app.get("/files/:filename", verifyToken, (req: Request, res: Response) => {
  const filePath = path.join(
    process.cwd(),
    "uploads",
    req.params.filename as string, // ← was req.body.filename
  );

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  res.sendFile(filePath);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
