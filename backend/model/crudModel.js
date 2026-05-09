import pool from "../db.js";

// Helper to get the correct ID column name based on table name
// backend/model/crudModel.js - Update the getPkName function
const getPkName = (table) => {
  if (table === "users") return "user_id";
  if (table === "categories") return "category_id";
  if (table === "laboratories") return "lab_id";
  if (table === "equipment") return "equipment_id";
  if (table === "peripherals") return "peripheral_id"; // Add this
  if (table === "borrow_transactions") return "transaction_id";
  if (table === "damage_reports") return "report_id";
  return "id";
};

export const insertData = async (data, table) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
  const columns = keys.join(", ");
  const query = `INSERT INTO clams.${table} (${columns}) VALUES (${placeholders}) RETURNING *`;

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateData = async (data, table, id) => {
  const pkName = getPkName(table);
  const entries = Object.entries(data);
  const setClause = entries.map(([key], i) => `${key} = $${i + 1}`).join(", ");
  const values = entries.map(([_, value]) => value);
  values.push(id);

  const query = `UPDATE clams.${table} SET ${setClause} WHERE ${pkName} = $${values.length} RETURNING *`;
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const softDelete = async (id, table) => {
  const pkName = getPkName(table);
  // Note: Only tables with 'is_deleted' column will work here
  const query = `UPDATE clams.${table} SET is_deleted = true WHERE ${pkName} = $1 RETURNING *`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
