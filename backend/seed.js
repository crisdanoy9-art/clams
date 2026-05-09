import pool from "./db.js";
import bcrypt from "bcrypt"; // MUST IMPORT THIS

const seedDatabase = async () => {
  try {
    console.log("Starting full database seeding...");

    // 1. Wipe everything and reset IDs to 1
    await pool.query(`
      TRUNCATE 
        clams.activity_logs, 
        clams.damage_reports, 
        clams.borrow_transactions, 
        clams.equipment, 
        clams.peripherals, 
        clams.laboratories, 
        clams.categories, 
        clams.users 
      RESTART IDENTITY CASCADE;
    `);

    // 2. Seed Users (CRITICAL: Hash the password so Login works)
    const saltRounds = 10;
    const hashedPw = await bcrypt.hash("admin123", saltRounds); // Use a known password

    const userRes = await pool.query(
      `
      INSERT INTO clams.users (id_number, username, password_hash, first_name, last_name, email, role)
      VALUES ('ID-001', 'admin', $1, 'Leo', 'Alolino', 'leo@example.com', 'admin')
      RETURNING user_id;
    `,
      [hashedPw],
    );

    const adminUuid = userRes.rows[0].user_id;
    console.log(`User created with UUID: ${adminUuid}`);

    // 3. Seed Categories
    await pool.query(`
      INSERT INTO clams.categories (category_name)
      VALUES ('Computing Devices'), ('Input Devices'), ('Display');
    `);

    // 4. Seed Laboratories
    await pool.query(`
      INSERT INTO clams.laboratories (lab_name, room_number, building, total_stations)
      VALUES ('Software Lab 1', '301', 'Engineering Bldg', 40);
    `);

    // 5. Seed Equipment (category_id 1 = Computing Devices, lab_id 1 = Software Lab 1)
    await pool.query(`
      INSERT INTO clams.equipment (asset_tag, item_name, category_id, brand, model, serial_number, specs, lab_id, status)
      VALUES ('ASSET-001', 'MacBook Air M2', 1, 'Apple', 'A2681', 'SN-MAC-789', '{"cpu": "M2", "ram": "16GB"}', 1, 'working');
    `);

    // 6. Seed Peripherals
    await pool.query(`
      INSERT INTO clams.peripherals (item_name, category_id, brand, lab_id, working_count, damaged_count)
      VALUES ('Logitech MX Master', 2, 'Logitech', 1, 15, 0);
    `);

    // 7. Seed a Transaction
    await pool.query(
      `
      INSERT INTO clams.borrow_transactions (instructor_id, borrower_name, equipment_id, quantity, status, expected_return_date)
      VALUES ($1, 'Student Tester', 1, 1, 'borrowed', '2026-05-15');
    `,
      [adminUuid],
    );

    // 8. Seed a Damage Report
    await pool.query(
      `
      INSERT INTO clams.damage_reports (instructor_id, equipment_id, subject, description, status)
      VALUES ($1, 1, 'Battery Issue', 'The battery is draining too fast.', 'pending');
    `,
      [adminUuid],
    );

    console.log(
      "SUCCESS: All tables seeded. You can now login with 'admin' / 'admin123'",
    );
    process.exit(0);
  } catch (err) {
    console.error("SEEDING FAILED:", err);
    process.exit(1);
  }
};

seedDatabase();

// { label: "Keyboard", value: "keyboard" },
// { label: "Mouse", value: "mouse" },
// { label: "Headset", value: "headset" },
// { label: "Microphone", value: "microphone" },
// { label: "Camera", value: "camera" },
// { label: "Printer", value: "printer" },
// { label: "Monitor", value: "monitor" },
// { label: "Speakers", value: "speakers" }
