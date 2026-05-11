import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { 
  Post, Update, Remove, 
  getUnreadActivityCount, 
  markActivitiesAsRead, 
  markSingleActivityAsRead,
  getRecentActivities,
  BulkCreateEquipment,
  BulkCreatePeripherals
} from "../controller/crudController.js";
import {
  getAllInventory,
  getAllReports,
  getAllTransactionHistory,
} from "../controller/joinController.js";
import pool from "../db.js";

const crud = Router();

// ==========================
// NOTIFICATION ROUTES
// ==========================
crud.get("/activities/unread-count", verifyToken, getUnreadActivityCount);
crud.put("/activities/mark-read", verifyToken, markActivitiesAsRead);
crud.put("/activities/:logId/mark-read", verifyToken, markSingleActivityAsRead);
crud.get("/activities/recent", verifyToken, getRecentActivities);

// ==========================
// BULK OPERATION ROUTES
// ==========================
crud.post("/create/equipment/bulk", verifyToken, BulkCreateEquipment);
crud.post("/create/peripherals/bulk", verifyToken, BulkCreatePeripherals);

// ==========================
// PUBLIC GET ROUTES (no token)
// ==========================
crud.get("/inventory", getAllInventory);
crud.get("/transactions", getAllTransactionHistory);
crud.get("/reports", getAllReports);

crud.get("/laboratories", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM clams.laboratories ORDER BY lab_name"
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
      "SELECT * FROM clams.categories ORDER BY category_name"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: error.message });
  }
});

crud.get("/peripherals", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.item_name,
        p.brand,
        COALESCE(c.category_name, 'Uncategorized') AS category_name,
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

crud.get("/equipment-list", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT equipment_id, pc_name, item_name, lab_id
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
      [labId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
      [equipmentId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================
// PROTECTED GET ROUTES (require token)
// ==========================
crud.get("/users", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }
  try {
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
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }
  try {
    const { limit, page = 1 } = req.query;
    const itemsPerPage = parseInt(limit) || 50;
    const offset = (parseInt(page) - 1) * itemsPerPage;
    
    const countResult = await pool.query(`SELECT COUNT(*) as total FROM clams.activity_logs`);
    const total = parseInt(countResult.rows[0].total);
    
    let query = `
      SELECT al.*, u.first_name, u.last_name, u.username, u.role as user_role
      FROM clams.activity_logs al
      LEFT JOIN clams.users u ON al.user_id = u.user_id
      ORDER BY al.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [itemsPerPage, offset]);
    
    res.json({
      logs: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / itemsPerPage),
        totalItems: total,
        itemsPerPage: itemsPerPage
      }
    });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================
// PERIPHERAL BULK OPERATIONS
// ==========================
crud.post("/create/peripherals/bulk", verifyToken, BulkCreatePeripherals);

crud.post("/peripherals/delete-type", verifyToken, async (req, res) => {
  const { item_name, brand, quantity } = req.body.data;
  if (!item_name || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Invalid request" });
  }
  try {
    const brandValue = brand && brand.trim() !== "" ? brand : null;
    const result = await pool.query(
      `UPDATE clams.peripherals
       SET is_deleted = true
       WHERE peripheral_id IN (
         SELECT peripheral_id FROM clams.peripherals
         WHERE item_name = $1
           AND (brand = $2 OR ($2 IS NULL AND brand IS NULL))
           AND is_deleted = false
         ORDER BY peripheral_id
         LIMIT $3
       )
       RETURNING peripheral_id`,
      [item_name, brandValue, quantity]
    );
    
    // Log bulk delete
    const { logBulkActivity } = await import("../controller/crudController.js");
    await logBulkActivity(req.user.user_id, "BULK_DELETE", "peripherals", null, result.rowCount, `Deleted ${result.rowCount} units of ${item_name}`);
    
    res.json({ deleted: result.rowCount });
  } catch (error) {
    console.error("Delete peripherals error:", error);
    res.status(500).json({ error: error.message });
  }
});

crud.put("/peripherals/:peripheralId/status", verifyToken, async (req, res) => {
  const { peripheralId } = req.params;
  const { status } = req.body.data;
  if (!["working", "damaged"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  try {
    await pool.query(
      `UPDATE clams.peripherals SET status = $1 WHERE peripheral_id = $2`,
      [status, peripheralId]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================
// ATTACH / DETACH PERIPHERALS
// ==========================
crud.post("/equipment/:equipmentId/attach-peripheral", verifyToken, async (req, res) => {
  const { equipmentId } = req.params;
  const { peripheral_id } = req.body.data;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const check = await client.query(
      `SELECT p.lab_id, e.lab_id as equipment_lab_id
       FROM clams.peripherals p, clams.equipment e
       WHERE p.peripheral_id = $1 AND e.equipment_id = $2`,
      [peripheral_id, equipmentId]
    );
    if (check.rows.length === 0) throw new Error("Peripheral or equipment not found");
    if (check.rows[0].lab_id !== check.rows[0].equipment_lab_id) {
      throw new Error("Peripheral lab does not match equipment lab");
    }
    await client.query(
      `UPDATE clams.peripherals SET equipment_id = $1 WHERE peripheral_id = $2`,
      [equipmentId, peripheral_id]
    );
    await client.query("COMMIT");
    res.json({ success: true, message: "Peripheral attached" });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});

crud.post("/equipment/:equipmentId/detach-peripheral", verifyToken, async (req, res) => {
  const { equipmentId } = req.params;
  const { peripheral_id, new_status } = req.body.data;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const check = await client.query(
      `SELECT peripheral_id FROM clams.peripherals
       WHERE peripheral_id = $1 AND equipment_id = $2`,
      [peripheral_id, equipmentId]
    );
    if (check.rows.length === 0) throw new Error("Peripheral not attached to this equipment");
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
});

// ==========================
// EQUIPMENT SPEC UPDATES
// ==========================
crud.put("/update/equipment-spec/:equipment_id/:component", verifyToken, async (req, res) => {
  try {
    const { equipment_id, component } = req.params;
    const { status } = req.body.data;
    if (!["good", "bad"].includes(status)) {
      return res.status(400).json({ error: "Status must be 'good' or 'bad'" });
    }
    const path = `{${component}_status}`;
    const newValue = `"${status}"`;
    const result = await pool.query(
      `UPDATE clams.equipment
       SET specs = jsonb_set(specs, $1, $2, true)
       WHERE equipment_id = $3
       RETURNING *`,
      [path, newValue, equipment_id]
    );
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
});

crud.put("/update/equipment-specs/:equipment_id", verifyToken, async (req, res) => {
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
});

// ==========================
// GENERIC CRUD
// ==========================
crud.post("/create/:table", verifyToken, upload.any(), Post);
crud.put("/update/:table/:id", verifyToken, upload.any(), Update);
crud.delete("/remove/:table/:id", verifyToken, Remove);

export default crud;