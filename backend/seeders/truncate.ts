import pool from "../db";

async function TruncateAll() {
  try {
    await pool.query(`
      TRUNCATE TABLE 
        clams.activity_logs,
        clams.damage_reports,
        clams.borrow_transactions,
        clams.peripherals,
        clams.equipment,
        clams.categories,
        clams.laboratories,
        clams.users
      RESTART IDENTITY CASCADE;
    `);

    console.log("All tables in 'clams' schema truncated and sequences reset.");
  } catch (e: any) {
    console.error(`Truncate failed: ${e.message}`);
  }
}

TruncateAll();
