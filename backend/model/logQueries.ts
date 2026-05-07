import pool from "../db";

export const insertLog = async (
  user_id: string | null,
  action: string,
  table_affected: string,
  record_id: string,
) => {
  console.log("📝 insertLog called:", {
    user_id,
    action,
    table_affected,
    record_id,
  });
  await pool.query(
    `INSERT INTO clams.activity_logs (user_id, action, table_affected, record_id)
     VALUES ($1, $2, $3, $4)`,
    [user_id, action, table_affected, record_id],
  );
  console.log("✅ insertLog success");
};
