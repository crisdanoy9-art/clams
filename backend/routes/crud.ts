import { Router } from "express";
import { Get, GetOne, Post, Put, Delete } from "../controller/crudController";

const crud = Router();

crud.get("/:table", Get);
crud.get("/:table/:id", GetOne);
crud.post("/:table", Post);
crud.put("/:table/:id", Put);
crud.delete("/:table/:id", Delete);

export default crud;
