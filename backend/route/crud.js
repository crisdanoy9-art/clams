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

// backend/route/crud.js (partial – add/replace these)

crud.get("/peripherals", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.item_name,
        p.brand,
        c.category_name,
        COUNT(CASE WHEN p.status = 'working' THEN 1 END)::int AS working_count,
        COUNT(CASE WHEN p.status = 'damaged' THEN 1 END)::int AS damaged_count,
        COUNT(*)::int AS total_count
      FROM clams.peripherals p
      LEFT JOIN clams.categories c ON p.category_id = c.category_id
      WHERE p.is_deleted = false
      GROUP BY p.item_name, p.brand, c.category_name
      ORDER BY p.item_name
    `);
    const rows = result.rows.map((row, idx) => ({
      ...row,
      peripheral_id: idx + 1,
    }));
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Bulk create – adds many individual rows (all 'working')
crud.post("/create/peripherals/bulk", verifyToken, async (req, res) => {
  const { item_name, brand, category_id, lab_id, copies } = req.body.data;
  const count = parseInt(copies) || 1;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (let i = 0; i < count; i++) {
      await client.query(
        `
        INSERT INTO clams.peripherals (item_name, brand, category_id, lab_id, status)
        VALUES ($1, $2, $3, $4, 'working')
      `,
        [item_name, brand || null, category_id || null, lab_id || null],
      );
    }
    await client.query("COMMIT");
    // Log activity once for the batch
    const { logActivity } = await import("../model/logsModel.js");
    await logActivity(req.user.user_id, "CREATE", "peripherals", null);
    res.json({ success: true, message: `Added ${count} peripheral(s)` });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Get peripherals available in a lab (stock) – not attached to any equipment
crud.get("/peripherals/stock/:labId", async (req, res) => {
  const { labId } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT peripheral_id, item_name, brand, category_id, status
      FROM clams.peripherals
      WHERE lab_id = $1 AND equipment_id IS NULL AND is_deleted = false
      ORDER BY item_name
    `,
      [labId],
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get peripherals attached to a specific equipment
crud.get("/equipment/:equipmentId/peripherals", async (req, res) => {
  const { equipmentId } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT p.peripheral_id, p.item_name, p.brand, p.status, c.category_name
      FROM clams.peripherals p
      LEFT JOIN clams.categories c ON p.category_id = c.category_id
      WHERE p.equipment_id = $1 AND p.is_deleted = false
    `,
      [equipmentId],
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Attach a peripheral to equipment (move from stock to PC)
crud.post(
  "/equipment/:equipmentId/attach-peripheral",
  verifyToken,
  async (req, res) => {
    const { equipmentId } = req.params;
    const { peripheral_id } = req.body.data;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // Check peripheral exists, is in stock (equipment_id IS NULL) and belongs to the same lab as the equipment
      const check = await client.query(
        `
      SELECT p.lab_id, e.lab_id as equipment_lab_id
      FROM clams.peripherals p, clams.equipment e
      WHERE p.peripheral_id = $1 AND e.equipment_id = $2
    `,
        [peripheral_id, equipmentId],
      );
      if (check.rows.length === 0)
        throw new Error("Peripheral or equipment not found");
      if (check.rows[0].lab_id !== check.rows[0].equipment_lab_id) {
        throw new Error("Peripheral lab does not match equipment lab");
      }
      // Update peripheral: set equipment_id, keep status (default working)
      await client.query(
        `
      UPDATE clams.peripherals SET equipment_id = $1 WHERE peripheral_id = $2
    `,
        [equipmentId, peripheral_id],
      );
      await client.query("COMMIT");
      res.json({ success: true, message: "Peripheral attached" });
    } catch (error) {
      await client.query("ROLLBACK");
      res.status(400).json({ error: error.message });
    } finally {
      client.release();
    }
  },
);

// Detach peripheral (return to stock) – optionally change status
crud.post(
  "/equipment/:equipmentId/detach-peripheral",
  verifyToken,
  async (req, res) => {
    const { equipmentId } = req.params;
    const { peripheral_id, new_status } = req.body.data; // new_status optional
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // Verify peripheral is attached to this equipment
      const check = await client.query(
        `
      SELECT peripheral_id FROM clams.peripherals
      WHERE peripheral_id = $1 AND equipment_id = $2
    `,
        [peripheral_id, equipmentId],
      );
      if (check.rows.length === 0)
        throw new Error("Peripheral not attached to this equipment");
      // Update: remove equipment_id, optionally change status
      let query = `UPDATE clams.peripherals SET equipment_id = NULL`;
      const params = [peripheral_id];
      if (new_status) {
        query += `, status = $2`;
        params.push(new_status);
      }
      query += ` WHERE peripheral_id = $1`;
      await client.query(query, params);
      await client.query("COMMIT");
      res.json({ success: true, message: "Peripheral detached" });
    } catch (error) {
      await client.query("ROLLBACK");
      res.status(400).json({ error: error.message });
    } finally {
      client.release();
    }
  },
);

// Update peripheral status (working/damaged) – for attached peripherals
crud.put("/peripherals/:peripheralId/status", verifyToken, async (req, res) => {
  const { peripheralId } = req.params;
  const { status } = req.body.data;
  if (!["working", "damaged"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  try {
    await pool.query(
      `
      UPDATE clams.peripherals SET status = $1 WHERE peripheral_id = $2
    `,
      [status, peripheralId],
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Also keep your existing endpoints (equipment-list, laboratories, etc.)
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
    res.status(500).json({ error: error.message });
  }
});

crud.get("/laboratories", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM clams.laboratories ORDER BY lab_name",
    );
    res.json(result.rows);
  } catch (error) {
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
        equipmecrdnt: result.rows[0],
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
