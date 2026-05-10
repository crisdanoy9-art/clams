// backend/controller/crudController.js
import { insertData, updateData, softDelete } from "../model/crudModel.js";
import { logActivity } from "../model/logsModel.js";
import pool from "../db.js"; // <-- IMPORT pool to run raw queries

// Tables that have an instructor_id column
const INSTRUCTOR_TABLES = ["damage_reports", "borrow_transactions"];

const prepareData = (req, table) => {
  let bodyData = req.body.data;

  if (typeof bodyData === "string") {
    try {
      bodyData = JSON.parse(bodyData);
    } catch (e) {}
  } else if (!bodyData) {
    bodyData = req.body;
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

// Helper: Update total_stations for a lab based on active equipment count
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
    [labId],
  );
  // Optional: log the new total
  if (result.rows.length) {
    console.log(
      `Lab ${labId} total_stations updated to ${result.rows[0].total_stations}`,
    );
  }
};

export const Post = async (req, res) => {
  try {
    const { table } = req.params;
    const bodyData = prepareData(req, table);
    const result = await insertData(bodyData, table);

    // If we just added equipment, update the lab's total_stations
    if (table === "equipment" && result.lab_id) {
      await updateLabTotalStations(result.lab_id);
    }

    let recordId = null;
    const idKey = Object.keys(result).find(
      (key) => key.includes("_id") || key === "id",
    );
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
    const bodyData = prepareData(req, table);

    // For equipment, we need the old lab_id before update to detect changes
    let oldLabId = null;
    if (table === "equipment") {
      const oldEquipment = await pool.query(
        `SELECT lab_id FROM clams.equipment WHERE equipment_id = $1`,
        [id],
      );
      oldLabId = oldEquipment.rows[0]?.lab_id;
    }

    const result = await updateData(bodyData, table, id);
    if (!result) return res.status(404).json({ msg: "Record not found" });

    // If equipment was updated and lab_id changed, update both old and new labs
    if (table === "equipment") {
      const newLabId = result.lab_id;
      if (oldLabId && oldLabId !== newLabId) {
        await updateLabTotalStations(oldLabId);
        await updateLabTotalStations(newLabId);
      } else if (newLabId) {
        // lab_id didn't change, but still update (in case status changed? No, total_stations only counts equipment, no need)
        // Actually if lab_id didn't change, total_stations remains the same. No action.
        // But if you want to be safe, you can update anyway (it's idempotent)
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

    // For equipment, we need the lab_id before soft delete to update total_stations
    let labId = null;
    if (table === "equipment") {
      const equipment = await pool.query(
        `SELECT lab_id FROM clams.equipment WHERE equipment_id = $1`,
        [id],
      );
      labId = equipment.rows[0]?.lab_id;
    }

    const result = await softDelete(id, table);
    if (!result) {
      return res
        .status(404)
        .json({ msg: "Record not found or table doesn't support soft delete" });
    }

    // After soft delete, update the lab's total_stations (the equipment is now counted as deleted)
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
