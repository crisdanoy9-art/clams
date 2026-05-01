import express, { Request, Response } from "express";
import auth from "./routes/auth";
import crud from "./routes/crud";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount the router
app.use("/users", auth);
app.use("/api", crud);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
