import { Request, Response } from 'express';
import pool from "../src/db";

// 1. GET (With Relationship - LEFT JOIN)
// Use this for the items table to see the category names
export const JoinData = async (req: Request, res: Response) => { 
  try {
    const query = `
      SELECT items.*, categories.category_name 
      FROM items
      LEFT JOIN categories ON items.category_id = categories.category_id
    `;
    const result = await pool.query(query);
    return res.status(200).json({ data: result.rows });
  }
  catch(e: any) {
    return res.status(400).json({ data: `data not found`, status: 'failed', error: e.message })
  }
}

// 2. GET (No Relationship - SIMPLE SELECT)
// Use this for standalone tables like 'categories' or 'users'
export const Get = async (req: Request, res: Response) => { 
  const {table} = req.body
  try {
    const result = await pool.query(`SELECT * FROM clams.${table}`);
    return res.status(200).json({ data: result.rows });
  }
  catch(e: any) {
    return res.status(400).json({ data: `data not found`, status: 'failed', error: e.message })
  }
}

// 3. POST
export const Post = async (req: Request, res: Response) => {
  try {
    const { item_name, category_id } = req.body;
    const query = 'INSERT INTO items (item_name, category_id) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [item_name, category_id]);
    res.status(201).json({ message: 'Item created', data: result.rows[0] });
  }
  catch(error: any) {
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
}

// 4. UPDATE
export const Update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { item_name, category_id } = req.body;
    const query = 'UPDATE items SET item_name = $1, category_id = $2 WHERE item_id = $3 RETURNING *';
    const result = await pool.query(query, [item_name, category_id, id]);
    res.status(200).json({ message: 'Item updated', data: result.rows[0] });
  } 
  catch (error: any) {
    res.status(500).json({ message: 'Error updating', error: error.message });
  }
}

// 5. DELETE
export const Delete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM items WHERE item_id = $1', [id]);
    res.status(200).json({ message: 'Item deleted successfully' });
  } 
  catch (error: any) {
    res.status(500).json({ message: 'Error deleting', error: error.message });
  }
}