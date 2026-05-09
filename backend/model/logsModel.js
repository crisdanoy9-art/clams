// backend/model/logsModel.js
import pool from "../db.js";

export const logActivity = async (userId, action, tableAffected, recordId) => {
  try {
    // recordId should already be numeric from the controller
    const query = `
      INSERT INTO clams.activity_logs (user_id, action, table_affected, record_id)
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(query, [userId, action, tableAffected, recordId]);
    console.log(
      `✅ Logged: ${action} on ${tableAffected} (Record: ${recordId})`,
    );
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
