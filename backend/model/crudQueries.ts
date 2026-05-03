import pool from "../db";

const allowedTables = [
  "users",
  "laboratories",
  "categories",
  "equipment",
  "peripherals",
  "borrow_transactions",
  "damage_reports",
];

export const getLabsWithStats = async () => {
  const result = await pool.query(`
    SELECT
      l.*,
      COUNT(dr.report_id) FILTER (WHERE dr.status NOT IN ('resolved', 'closed'))::int AS damaged_stations,
      l.total_stations - COUNT(dr.report_id) FILTER (WHERE dr.status NOT IN ('resolved', 'closed'))::int AS available_stations
    FROM clams.laboratories l
    LEFT JOIN clams.damage_reports dr ON dr.lab_id = l.lab_id
    GROUP BY l.lab_id
    ORDER BY l.lab_id
  `);
  return result.rows;
};

const validateTable = (table: string) => {
  if (!allowedTables.includes(table)) throw new Error("Invalid table");
};

export const getAll = async (table: string) => {
  validateTable(table);

  if (table === "laboratories") return getLabsWithStats();

  const result = await pool
    .query(`SELECT * FROM clams.${table} WHERE is_deleted = FALSE`)
    .catch(() => pool.query(`SELECT * FROM clams.${table}`));
  return result.rows;
};

export const getOne = async (table: string, id: string, idCol: string) => {
  validateTable(table);
  const result = await pool.query(
    `SELECT * FROM clams.${table} WHERE ${idCol} = $1`,
    [id],
  );
  return result.rows[0];
};

export const insertOne = async (table: string, data: Record<string, any>) => {
  validateTable(table);
  const columns = Object.keys(data).join(", ");
  const values = Object.values(data);
  const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
  const result = await pool.query(
    `INSERT INTO clams.${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
    values,
  );
  return result.rows[0];
};

export const updateOne = async (
  table: string,
  id: string,
  idCol: string,
  data: Record<string, any>,
) => {
  validateTable(table);
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  const result = await pool.query(
    `UPDATE clams.${table} SET ${setClause} WHERE ${idCol} = $${keys.length + 1} RETURNING *`,
    [...values, id],
  );
  return result.rows[0];
};

export const softDelete = async (table: string, id: string, idCol: string) => {
  validateTable(table);
  const result = await pool.query(
    `UPDATE clams.${table} SET is_deleted = TRUE WHERE ${idCol} = $1 RETURNING *`,
    [id],
  );
  return result.rows[0];
};
