import { Router } from "express";
import { Get, GetOne, Post, Put, Delete } from "../controller/crudController";
import { upload } from "../middleware/upload";
import { getLabsWithStats } from "../model/crudQueries";

const crud = Router();
crud.get("/laboratories/stats", async (req, res) => {
  try {
    const data = await getLabsWithStats();
    res.status(200).json({ data });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
crud.get("/:table", Get);
crud.get("/:table/:id", GetOne);
crud.post("/:table", upload.single("file"), Post); // "file" = form field name
crud.put("/:table/:id", upload.single("file"), Put);
crud.delete("/:table/:id", Delete);

export default crud;
