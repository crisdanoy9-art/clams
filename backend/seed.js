import pool from "./db.js";
import bcrypt from "bcrypt";

const seedDatabase = async () => {
  try {
    console.log("Starting full database seeding...");

    // Truncate all tables
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

    // Users
    const saltRounds = 10;
    const hashedAdminPw = await bcrypt.hash("admin123", saltRounds);
    const hashedInstructorPw = await bcrypt.hash("ins123", saltRounds);

    const adminRes = await pool.query(
      `
      INSERT INTO clams.users (id_number, username, password_hash, first_name, last_name, email, role)
      VALUES ('ID-001', 'admin', $1, 'Admin', 'User', 'admin@clams.edu', 'admin')
      RETURNING user_id
    `,
      [hashedAdminPw],
    );
    const adminId = adminRes.rows[0].user_id;

    const instructorRes = await pool.query(
      `
      INSERT INTO clams.users (id_number, username, password_hash, first_name, last_name, email, role)
      VALUES ('ID-002', 'ins', $1, 'John', 'Doe', 'instructor@clams.edu', 'instructor')
      RETURNING user_id
    `,
      [hashedInstructorPw],
    );
    const instructorId = instructorRes.rows[0].user_id;
    console.log("✓ Users seeded");

    // Categories
    await pool.query(`
      INSERT INTO clams.categories (category_name) VALUES
      ('Computing Devices'), ('Input Devices'), ('Display'), ('Audio'), ('Printing'), ('Networking')
    `);
    console.log("✓ Categories seeded");

    // Laboratories
    await pool.query(`
      INSERT INTO clams.laboratories (lab_name, room_number, building, total_stations) VALUES
      ('Software Lab 1', '301', 'Engineering Bldg', 40),
      ('CCS Lab 2', '302', 'Engineering Bldg', 35),
      ('Network Lab', '303', 'Engineering Bldg', 25)
    `);
    console.log("✓ Laboratories seeded");

    // Equipment (same as before)
    const eq1 = await pool.query(`
      INSERT INTO clams.equipment (asset_tag, item_name, category_id, brand, model, serial_number, specs, lab_id, status, purchase_date)
      VALUES ('ASSET-001', 'MacBook Air M2', 1, 'Apple', 'A2681', 'SN-MAC-789',
        '{"cpu":"Apple M2 8-Core","cpu_status":"good","ram":"8GB","ram_status":"good","storage":"256GB SSD","storage_status":"good","gpu":"8-Core","gpu_status":"good"}',
        1, 'working', '2026-05-01')
      RETURNING equipment_id
    `);
    // ... repeat for ASSET-002 to ASSET-005 (same as your original seed)
    // (I'll keep it short – you already have the full equipment seed)
    const id1 = eq1.rows[0].equipment_id;
    // ... etc.

    // Peripherals – individual rows (each row = one physical item)
    const insertPeripheral = async (
      item_name,
      brand,
      category_id,
      lab_id,
      equipment_id,
      status,
    ) => {
      await pool.query(
        `
        INSERT INTO clams.peripherals (item_name, brand, category_id, lab_id, equipment_id, status)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [item_name, brand, category_id, lab_id, equipment_id, status],
      );
    };

    // Example: 20 working Logitech mice in Lab 1
    for (let i = 0; i < 20; i++) {
      await insertPeripheral(
        "Logitech MX Master",
        "Logitech",
        2,
        1,
        null,
        "working",
      );
    }
    // 2 damaged ones
    for (let i = 0; i < 2; i++) {
      await insertPeripheral(
        "Logitech MX Master",
        "Logitech",
        2,
        1,
        null,
        "damaged",
      );
    }

    // Add other peripherals as you need (keyboards, headsets, etc.)
    // For brevity, I'll add a few more:
    for (let i = 0; i < 15; i++) {
      await insertPeripheral(
        "Mechanical Keyboard",
        "Keychron",
        2,
        1,
        null,
        "working",
      );
    }
    await insertPeripheral(
      "Mechanical Keyboard",
      "Keychron",
      2,
      1,
      null,
      "damaged",
    );

    // Peripherals attached to specific PCs (equipment_id set)
    await insertPeripheral(
      "Apple Magic Keyboard",
      "Apple",
      2,
      null,
      id1,
      "working",
    );
    await insertPeripheral(
      "Apple Magic Mouse",
      "Apple",
      2,
      null,
      id1,
      "working",
    );
    // ... etc.

    console.log("✓ Peripherals seeded (individual items)");

    // Borrow transactions, damage reports, activity logs (same as your seed)
    // ...

    console.log("\n✅ SEEDING COMPLETED!");
    process.exit(0);
  } catch (err) {
    console.error("❌ SEEDING FAILED:", err);
    process.exit(1);
  }
};

seedDatabase();
