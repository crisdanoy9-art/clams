import { insertData, updateData, softDelete } from "../model/crudModel.js";
import { logActivity } from "../model/logsModel.js";
import pool from "../db.js";
import bcrypt from "bcrypt";

const INSTRUCTOR_TABLES = ["damage_reports", "borrow_transactions"];
const SALT_ROUNDS = 10;

const prepareData = async (req, table) => {
  let bodyData = req.body.data;

  if (typeof bodyData === "string") {
    try {
      bodyData = JSON.parse(bodyData);
    } catch (e) {}
  } else if (!bodyData) {
    bodyData = req.body;
  }

  // Special handling for users table - hash password
  if (table === "users" && bodyData.password) {
    const hashedPassword = await bcrypt.hash(bodyData.password, SALT_ROUNDS);
    bodyData.password_hash = hashedPassword;
    delete bodyData.password;
    console.log("Password hashed for user creation");
  }

  if (req.user && req.user.user_id && INSTRUCTOR_TABLES.includes(table)) {
    bodyData.instructor_id = req.user.user_id;
  }

  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      bodyData[file.fieldname] = file.path;
    });
  }

  return bodyData;
};

const updateLabTotalStations = async (labId) => {
  if (!labId) return;
  const result = await pool.query(
    `UPDATE clams.laboratories 
     SET total_stations = (
       SELECT COUNT(*) FROM clams.equipment 
       WHERE lab_id = $1 AND is_deleted = false
     )
     WHERE lab_id = $1
     RETURNING total_stations`,
    [labId]
  );
  if (result.rows.length) {
    console.log(`Lab ${labId} total_stations updated to ${result.rows[0].total_stations}`);
  }
};

// ==================== CRUD FUNCTIONS ====================

export const Post = async (req, res) => {
  try {
    const { table } = req.params;
    const bodyData = await prepareData(req, table);
    const result = await insertData(bodyData, table);

    if (table === "equipment" && result.lab_id) {
      await updateLabTotalStations(result.lab_id);
    }

    let recordId = null;
    const idKey = Object.keys(result).find(key => key.includes("_id") || key === "id");
    if (idKey && result[idKey]) {
      recordId = parseInt(result[idKey]);
    }

    if (recordId && !isNaN(recordId)) {
      await logActivity(req.user.user_id, "CREATE", table, recordId);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Insert Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const Update = async (req, res) => {
  try {
    const { table, id } = req.params;
    const bodyData = await prepareData(req, table);

    let oldLabId = null;
    if (table === "equipment") {
      const oldEquipment = await pool.query(
        `SELECT lab_id FROM clams.equipment WHERE equipment_id = $1`,
        [id]
      );
      oldLabId = oldEquipment.rows[0]?.lab_id;
    }

    const result = await updateData(bodyData, table, id);
    if (!result) return res.status(404).json({ msg: "Record not found" });

    if (table === "equipment") {
      const newLabId = result.lab_id;
      if (oldLabId && oldLabId !== newLabId) {
        await updateLabTotalStations(oldLabId);
        await updateLabTotalStations(newLabId);
      } else if (newLabId) {
        await updateLabTotalStations(newLabId);
      }
    }

    const numericId = parseInt(id);
    if (!isNaN(numericId)) {
      await logActivity(req.user.user_id, "UPDATE", table, numericId);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const Remove = async (req, res) => {
  try {
    const { table, id } = req.params;

    let labId = null;
    if (table === "equipment") {
      const equipment = await pool.query(
        `SELECT lab_id FROM clams.equipment WHERE equipment_id = $1`,
        [id]
      );
      labId = equipment.rows[0]?.lab_id;
    }

    const result = await softDelete(id, table);
    if (!result) {
      return res.status(404).json({ msg: "Record not found or table doesn't support soft delete" });
    }

    if (table === "equipment" && labId) {
      await updateLabTotalStations(labId);
    }

    const numericId = parseInt(id);
    if (!isNaN(numericId)) {
      await logActivity(req.user.user_id, "DELETE", table, numericId);
    }

    return res.status(200).json({ msg: "Item moved to trash", data: result });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ==================== NOTIFICATION FUNCTIONS ====================

export const getUnreadActivityCount = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    console.log("getUnreadActivityCount - User ID:", userId);
    
    const lastViewed = await pool.query(
      `SELECT last_logs_viewed FROM clams.users WHERE user_id = $1`,
      [userId]
    );
    
    const lastViewedTime = lastViewed.rows[0]?.last_logs_viewed || new Date(0);
    
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM clams.activity_logs 
       WHERE created_at > $1`,
      [lastViewedTime]
    );
    
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error("Error getting unread activity count:", error);
    res.status(500).json({ error: error.message });
  }
};

export const markActivitiesAsRead = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    await pool.query(
      `UPDATE clams.users SET last_logs_viewed = CURRENT_TIMESTAMP WHERE user_id = $1`,
      [userId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking activities as read:", error);
    res.status(500).json({ error: error.message });
  }
};

export const markSingleActivityAsRead = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { logId } = req.params;
    
    const activity = await pool.query(
      `SELECT created_at FROM clams.activity_logs WHERE log_id = $1`,
      [logId]
    );
    
    if (activity.rows.length > 0) {
      const activityTime = new Date(activity.rows[0].created_at);
      activityTime.setMilliseconds(activityTime.getMilliseconds() + 1);
      
      await pool.query(
        `UPDATE clams.users SET last_logs_viewed = $1 WHERE user_id = $2 AND last_logs_viewed < $1`,
        [activityTime, userId]
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking activity as read:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getRecentActivities = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { limit = 10, page = 1 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const lastViewed = await pool.query(
      `SELECT last_logs_viewed FROM clams.users WHERE user_id = $1`,
      [userId]
    );
    
    const lastViewedTime = lastViewed.rows[0]?.last_logs_viewed || new Date(0);
    
    const result = await pool.query(
      `SELECT 
        al.log_id,
        al.action,
        al.table_affected,
        al.record_id,
        al.created_at,
        al.bulk_count,
        al.bulk_details,
        u.username,
        u.first_name,
        u.last_name,
        u.role as user_role,
        CASE 
          WHEN al.created_at > $1 THEN false
          ELSE true
        END as is_read
      FROM clams.activity_logs al
      LEFT JOIN clams.users u ON al.user_id = u.user_id
      ORDER BY al.created_at DESC
      LIMIT $2 OFFSET $3`,
      [lastViewedTime, parseInt(limit), offset]
    );
    
    const countResult = await pool.query(`SELECT COUNT(*) as total FROM clams.activity_logs`);
    const totalCount = parseInt(countResult.rows[0].total);
    
    res.json({
      activities: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error getting recent activities:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== BULK OPERATIONS ====================

export const BulkCreateEquipment = async (req, res) => {
  try {
    const { data } = req.body;
    const { pc_name_prefix, start_number, end_number, lab_id, item_name, brand, model, category_id, status, purchase_date } = data;
    
    const count = parseInt(end_number) - parseInt(start_number) + 1;
    const client = await pool.connect();
    let created = 0;
    
    try {
      await client.query("BEGIN");
      
      for (let i = parseInt(start_number); i <= parseInt(end_number); i++) {
        const pc_name = `${pc_name_prefix}${i}`;
        
        const specsString = JSON.stringify({
          cpu: data.cpu || "",
          cpu_status: data.cpu_status || "good",
          ram: data.ram || "",
          ram_status: data.ram_status || "good",
          storage: data.storage || "",
          storage_status: data.storage_status || "good",
          gpu: data.gpu || "",
          gpu_status: data.gpu_status || "good",
        });
        
        await client.query(
          `INSERT INTO clams.equipment (pc_name, item_name, brand, model, category_id, lab_id, status, purchase_date, specs)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [pc_name, item_name, brand || null, model || null, category_id ? parseInt(category_id) : null, parseInt(lab_id), status || "working", purchase_date || null, specsString]
        );
        created++;
      }
      
      await client.query("COMMIT");
      
      await updateLabTotalStations(parseInt(lab_id));
      
      await logActivity(req.user.user_id, "BULK_CREATE", "equipment", null, created, `Created ${created} PCs`);
      
      res.json({ success: true, created, message: `Created ${created} PCs` });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Bulk create error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const BulkCreatePeripherals = async (req, res) => {
  try {
    const { item_name, brand, category_id, lab_id, copies } = req.body.data;
    const count = parseInt(copies) || 1;
    const client = await pool.connect();
    
    try {
      await client.query("BEGIN");
      for (let i = 0; i < count; i++) {
        await client.query(
          `INSERT INTO clams.peripherals (item_name, brand, category_id, lab_id, status)
           VALUES ($1, $2, $3, $4, 'working')`,
          [item_name, brand || null, category_id || null, lab_id || null]
        );
      }
      await client.query("COMMIT");
      
      await logActivity(req.user.user_id, "BULK_CREATE", "peripherals", null, count, `Added ${count} peripherals`);
      
      res.json({ success: true, message: `Added ${count} peripheral(s)` });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Bulk create peripherals error:", error);
    res.status(500).json({ error: error.message });
  }
};