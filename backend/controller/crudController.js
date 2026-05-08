import { insertData, updateData, softDelete } from "../model/crudModel.js";

// Helper to parse data and attach files
const prepareData = (req) => {
  let bodyData = req.body.data;

  if (typeof bodyData === "string") {
    try {
      bodyData = JSON.parse(bodyData);
    } catch (e) {}
  } else if (!bodyData) {
    bodyData = req.body;
  }

  // AUTO-FILL USER ID
  // If the table needs an instructor_id or user_id, get it from the JWT!
  if (req.user && req.user.user_id) {
    // If the table is 'damage_reports' or 'borrow_transactions', use the ID from the token
    if (bodyData.hasOwnProperty("instructor_id")) {
      bodyData.instructor_id = req.user.user_id;
    }
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

    const result = await insertData(bodyData, table);
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
    if (!result)
      return res
        .status(404)
        .json({ msg: "Record not found or table doesn't support soft delete" });
    return res.status(200).json({ msg: "Item moved to trash", data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
