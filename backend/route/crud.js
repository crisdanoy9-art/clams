// backend/route/crud.js - UPDATE YOUR EXISTING FILE
import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { Post, Update, Remove } from "../controller/crudController.js";
import {
  getAllInventory,
  getAllReports,
  getAllTransactionHistory,
} from "../controller/joinController.js";
import pool from "../db.js";

const crud = Router();

// ===== PUBLIC GET ROUTES (No token required) =====
crud.get("/inventory", getAllInventory);
crud.get("/transactions", getAllTransactionHistory);
crud.get("/reports", getAllReports);
crud.get("/laboratories", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM clams.laboratories ORDER BY lab_name",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching laboratories:", error);
    res.status(500).json({ error: error.message });
  }
});
crud.get("/categories", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM clams.categories ORDER BY category_name",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATED: Peripherals endpoint with equipment join
crud.get("/peripherals", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*, 
        c.category_name, 
        l.lab_name,
        l.room_number,
        l.building,
        e.asset_tag as equipment_asset_tag,
        e.item_name as equipment_name
      FROM clams.peripherals p
      LEFT JOIN clams.categories c ON p.category_id = c.category_id
      LEFT JOIN clams.laboratories l ON p.lab_id = l.lab_id
      LEFT JOIN clams.equipment e ON p.equipment_id = e.equipment_id
      WHERE p.is_deleted = false
      ORDER BY p.item_name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching peripherals:", error);
    res.status(500).json({ error: error.message });
  }
});

// NEW: Equipment list endpoint for dropdowns
crud.get("/equipment-list", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT equipment_id, asset_tag, item_name, lab_id 
      FROM clams.equipment 
      WHERE is_deleted = false 
      ORDER BY item_name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching equipment list:", error);
    res.status(500).json({ error: error.message });
  }
});

// ===== PROTECTED GET ROUTES (Require token) =====
// backend/route/crud.js - Update the users endpoint
crud.get("/users", verifyToken, async (req, res) => {
  try {
    // Only admin can view all users
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    const result = await pool.query(`
      SELECT user_id, id_number, username, first_name, last_name, email, role, created_at 
      FROM clams.users 
      WHERE is_deleted = false OR is_deleted IS NULL
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
});

crud.get("/activity-logs", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }
    const { limit } = req.query;
    let query = `
      SELECT al.*, u.first_name, u.last_name, u.username, u.role as user_role
      FROM clams.activity_logs al
      LEFT JOIN clams.users u ON al.user_id = u.user_id
      ORDER BY al.created_at DESC
    `;
    if (limit) {
      query += ` LIMIT ${parseInt(limit)}`;
    }
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ error: error.message });
  }
});
// Add this to your backend/route/crud.js - right after your other GET routes
crud.get("/equipment-list", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT equipment_id, asset_tag, item_name, lab_id 
      FROM clams.equipment 
      WHERE is_deleted = false 
      ORDER BY item_name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching equipment list:", error);
    res.status(500).json({ error: error.message });
  }
});
// Update spec status endpoint
crud.put(
  "/update/equipment-spec/:equipment_id/:component",
  verifyToken,
  async (req, res) => {
    try {
      const { equipment_id, component } = req.params;
      const { status } = req.body.data;

      if (!["good", "bad"].includes(status)) {
        return res
          .status(400)
          .json({ error: "Status must be 'good' or 'bad'" });
      }

      const query = `
        UPDATE clams.equipment 
        SET specs = jsonb_set(specs, $1, $2, true)
        WHERE equipment_id = $3
        RETURNING *
      `;
      const path = `{${component}_status}`;
      const newValue = `"${status}"`;
      const result = await pool.query(query, [path, newValue, equipment_id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Equipment not found" });
      }

      res.json({
        success: true,
        message: `${component} status updated to ${status}`,
        equipment: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating spec status:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// Update multiple specs at once
crud.put(
  "/update/equipment-specs/:equipment_id",
  verifyToken,
  async (req, res) => {
    try {
      const { equipment_id } = req.params;
      const { updates } = req.body.data;

      let query = `UPDATE clams.equipment SET specs = specs `;
      const keys = Object.keys(updates);
      const values = [];

      keys.forEach((key, index) => {
        query += `|| jsonb_build_object('${key}', $${index + 1})`;
        values.push(updates[key]);
      });

      query += ` WHERE equipment_id = $${keys.length + 1} RETURNING *`;
      values.push(equipment_id);

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Equipment not found" });
      }

      res.json({
        success: true,
        message: "Specs updated successfully",
        equipment: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating specs:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// ===== PROTECTED CRUD ROUTES =====
crud.post("/create/:table", verifyToken, upload.any(), Post);
crud.put("/update/:table/:id", verifyToken, upload.any(), Update);
crud.delete("/remove/:table/:id", verifyToken, Remove);

export default crud;
