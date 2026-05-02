import { Router } from "express";
import { Get, GetOne, Post, Put, Delete } from "../controller/crudController";
import { upload } from "../middleware/upload";

const crud = Router();

crud.get("/:table", Get);
crud.get("/:table/:id", GetOne);
crud.post("/:table", upload.single("file"), Post); // "file" = form field name
crud.put("/:table/:id", upload.single("file"), Put);
crud.delete("/:table/:id", Delete);

export default crud;
