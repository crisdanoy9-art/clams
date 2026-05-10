import pool from "./db.js";
import bcrypt from "bcrypt";

const seedDatabase = async () => {
  try {
    console.log("Starting database seeding (users only)...");

    // Truncate all tables (optional - remove if you want to keep existing data)
    await pool.query(`
      TRUNCATE 
        clams.activity_logs, 
        clams.damage_reports, 
        clams.borrow_transactions, 
        clams.peripherals,
        clams.equipment, 
        clams.laboratories, 
        clams.categories, 
        clams.users 
      RESTART IDENTITY CASCADE;
    `);
    console.log("✓ Tables truncated");

    // Users only
    const saltRounds = 10;
    const hashedAdminPw = await bcrypt.hash("admin123", saltRounds);
    const hashedInstructorPw = await bcrypt.hash("ins123", saltRounds);

    await pool.query(
      `
      INSERT INTO clams.users (id_number, username, password_hash, first_name, last_name, email, role)
      VALUES 
        ('ID-001', 'admin', $1, 'CLAMS', 'ADMIN', 'admin@clams.JRMSU', 'admin'),
        ('ID-002', 'ins', $2, 'Mark', 'Mascardo', 'instructor@clams.JRMSU', 'instructor')
    `,
      [hashedAdminPw, hashedInstructorPw],
    );
    console.log("✓ Users seeded (admin@clams.JRMSU / admin123, instructor@clams.JRMSU / ins123)");

    console.log("\n✅ SEEDING COMPLETED! Only users were added.");
    console.log("💡 You can now add laboratories, categories, equipment, and peripherals through the UI.");
    process.exit(0);
  } catch (err) {
    console.error("❌ SEEDING FAILED:", err);
    process.exit(1);
  }
};

seedDatabase();