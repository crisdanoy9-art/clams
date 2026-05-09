// backend/controller/crudController.js
import { insertData, updateData, softDelete } from "../model/crudModel.js";
import { logActivity } from "../model/logsModel.js";

const prepareData = (req) => {
  let bodyData = req.body.data;

  if (typeof bodyData === "string") {
    try {
      bodyData = JSON.parse(bodyData);
    } catch (e) {}
  } else if (!bodyData) {
    bodyData = req.body;
  }

  // AUTO-FILL USER ID from JWT token - FIXED
  if (req.user && req.user.user_id) {
    // For damage_reports and borrow_transactions, always set instructor_id from token
    // This overrides any value sent from frontend
    bodyData.instructor_id = req.user.user_id;
  }

  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      bodyData[file.fieldname] = file.path;
    });
  }

  return bodyData;
};

// CREATE
export const Post = async (req, res) => {
  try {
    const { table } = req.params;
    const bodyData = prepareData(req);

    console.log(`Creating ${table} with data:`, bodyData); // Debug log

    const result = await insertData(bodyData, table);

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

// UPDATE
export const Update = async (req, res) => {
  try {
    const { table, id } = req.params;
    const bodyData = prepareData(req);

    const result = await updateData(bodyData, table, id);
    if (!result) return res.status(404).json({ msg: "Record not found" });

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

// SOFT DELETE
export const Remove = async (req, res) => {
  try {
    const { table, id } = req.params;
    const result = await softDelete(id, table);

    if (!result) {
      return res
        .status(404)
        .json({ msg: "Record not found or table doesn't support soft delete" });
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
