import { Router } from "express";
import { verifyToken } from "../middleware/auth.js"; // Fix 1: Added auth
import { upload } from "../middleware/upload.js"; // Fix 2: Added multer
import { Post, Update, Remove } from "../controller/crudController.js";
import {
  getAllInventory,
  getAllReports,
  getAllTransactionHistory,
} from "../controller/joinController.js";

const crud = Router();

// Protect ALL routes below this line with JWT
crud.use(verifyToken);

// --- CRUD ROUTES ---
// We use upload.any() on POST and PUT to handle potential image uploads
crud.post("/create/:table", upload.any(), Post);
crud.put("/update/:table/:id", upload.any(), Update);
crud.delete("/remove/:table/:id", Remove);

// --- JOIN ROUTES (Retrieval) ---
crud.get("/inventory", getAllInventory);
crud.get("/transactions", getAllTransactionHistory);
crud.get("/reports", getAllReports);

export default crud;
