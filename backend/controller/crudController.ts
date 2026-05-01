import { Request, Response } from "express";
import {
  getAll,
  getOne,
  insertOne,
  updateOne,
  softDelete,
} from "../model/crudQueries";

import { insertLog } from "../model/logQueries";

const getIdCol: Record<string, string> = {
  users: "user_id",
  laboratories: "lab_id",
  categories: "category_id",
  equipment: "equipment_id",
  peripherals: "peripheral_id",
  borrow_transactions: "transaction_id",
  damage_reports: "report_id",
};

export const Get = async (req: Request, res: Response): Promise<void> => {
  const table = req.params.table as string;
  try {
    const data = await getAll(table);
    res.status(200).json({ data });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const GetOne = async (req: Request, res: Response): Promise<void> => {
  const table = req.params.table as string;
  const id = req.params.id as string;
  try {
    const idCol = getIdCol[table] as string;
    const data = await getOne(table, id, idCol);
    if (!data) {
      res.status(404).json({ message: "data Not found" });
      return;
    }
    res.status(200).json({ data });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const Post = async (req: Request, res: Response): Promise<void> => {
  const table = req.params.table as string;
  const user_id = (req as any).user?.user_id ?? null;
  try {
    const data = await insertOne(table, req.body);
    const idCol = getIdCol[table] as string;
    await insertLog(user_id, "CREATE", table, String(data[idCol]));
    res.status(201).json({ message: "Created", data });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const Put = async (req: Request, res: Response): Promise<void> => {
  const table = req.params.table as string;
  const id = req.params.id as string;
  const user_id = (req as any).user?.user_id ?? null;
  try {
    const idCol = getIdCol[table] as string;
    const data = await updateOne(table, id, idCol, req.body);
    await insertLog(user_id, "UPDATE", table, id);
    res.status(200).json({ message: "successfully updated", data });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const Delete = async (req: Request, res: Response): Promise<void> => {
  const table = req.params.table as string;
  const id = req.params.id as string;
  const user_id = (req as any).user?.user_id ?? null;
  try {
    const idCol = getIdCol[table] as string;
    const data = await softDelete(table, id, idCol);
    if (!data) {
      res.status(404).json({ message: "data does not exist" });
      return;
    }
    await insertLog(user_id, "DELETE", table, id);
    res.status(200).json({ message: "successfully deleted data", data });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};
