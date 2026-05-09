// backend/seed.js
import pool from "./db.js";
import bcrypt from "bcrypt";

const seedDatabase = async () => {
  try {
    console.log("Starting full database seeding...");

    // 1. Wipe everything and reset IDs to 1
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

    // 2. Seed Users
    const saltRounds = 10;
    const hashedAdminPw = await bcrypt.hash("admin123", saltRounds);
    const hashedInstructorPw = await bcrypt.hash("ins123", saltRounds);

    const adminRes = await pool.query(
      `
      INSERT INTO clams.users (id_number, username, password_hash, first_name, last_name, email, role)
      VALUES ('ID-001', 'admin', $1, 'Admin', 'User', 'admin@clams.edu', 'admin')
      RETURNING user_id;
      `,
      [hashedAdminPw],
    );
    const adminId = adminRes.rows[0].user_id;
    console.log(`✓ Admin user created: ${adminId}`);

    const instructorRes = await pool.query(
      `
      INSERT INTO clams.users (id_number, username, password_hash, first_name, last_name, email, role)
      VALUES ('ID-002', 'ins', $1, 'John', 'Doe', 'instructor@clams.edu', 'instructor')
      RETURNING user_id;
      `,
      [hashedInstructorPw],
    );
    const instructorId = instructorRes.rows[0].user_id;
    console.log(`✓ Instructor user created: ${instructorId}`);

    // 3. Seed Categories
    await pool.query(`
      INSERT INTO clams.categories (category_name)
      VALUES 
        ('Computing Devices'),
        ('Input Devices'),
        ('Display'),
        ('Audio'),
        ('Printing'),
        ('Networking');
    `);
    console.log("✓ Categories seeded");

    // 4. Seed Laboratories
    await pool.query(`
      INSERT INTO clams.laboratories (lab_name, room_number, building, total_stations)
      VALUES 
        ('Software Lab 1', '301', 'Engineering Bldg', 40),
        ('CCS Lab 2', '302', 'Engineering Bldg', 35),
        ('Network Lab', '303', 'Engineering Bldg', 25);
    `);
    console.log("✓ Laboratories seeded");

    // 5. Seed Equipment
    const eq1 = await pool.query(`
      INSERT INTO clams.equipment (asset_tag, item_name, category_id, brand, model, serial_number, specs, lab_id, status, purchase_date)
      VALUES ('ASSET-001', 'MacBook Air M2', 1, 'Apple', 'A2681', 'SN-MAC-789',
        '{"cpu":"Apple M2 8-Core","cpu_status":"good","ram":"8GB Unified Memory","ram_status":"good","storage":"256GB SSD","storage_status":"good","gpu":"8-Core GPU","gpu_status":"good"}',
        1, 'working', '2026-05-01')
      RETURNING equipment_id;
    `);

    const eq2 = await pool.query(`
      INSERT INTO clams.equipment (asset_tag, item_name, category_id, brand, model, serial_number, specs, lab_id, status, purchase_date)
      VALUES ('ASSET-002', 'Dell Workstation', 1, 'Dell', 'Precision 3660', 'SN-DELL-002',
        '{"cpu":"Intel i7-12700","cpu_status":"good","ram":"16GB DDR4","ram_status":"bad","storage":"512GB SSD","storage_status":"good","gpu":"Integrated","gpu_status":"good"}',
        1, 'working', '2026-05-02')
      RETURNING equipment_id;
    `);

    const eq3 = await pool.query(`
      INSERT INTO clams.equipment (asset_tag, item_name, category_id, brand, model, serial_number, specs, lab_id, status, purchase_date)
      VALUES ('ASSET-003', 'HP Laptop', 1, 'HP', 'EliteBook', 'SN-HP-003',
        '{"cpu":"Intel i5-1240P","cpu_status":"good","ram":"16GB DDR4","ram_status":"good","storage":"256GB SSD","storage_status":"bad","gpu":"Integrated Iris Xe","gpu_status":"good"}',
        1, 'working', '2026-05-03')
      RETURNING equipment_id;
    `);

    const eq4 = await pool.query(`
      INSERT INTO clams.equipment (asset_tag, item_name, category_id, brand, model, serial_number, specs, lab_id, status, purchase_date)
      VALUES ('ASSET-004', 'Lenovo ThinkPad', 1, 'Lenovo', 'X1 Carbon', 'SN-LEN-004',
        '{"cpu":"Intel i7-1260P","cpu_status":"bad","ram":"32GB LPDDR5","ram_status":"good","storage":"1TB NVMe","storage_status":"good","gpu":"Integrated","gpu_status":"good"}',
        1, 'working', '2026-05-04')
      RETURNING equipment_id;
    `);

    const eq5 = await pool.query(`
      INSERT INTO clams.equipment (asset_tag, item_name, category_id, brand, model, serial_number, specs, lab_id, status, purchase_date)
      VALUES ('ASSET-005', 'Mac Mini M2', 1, 'Apple', 'M2', 'SN-MAC-005',
        '{"cpu":"Apple M2","cpu_status":"good","ram":"16GB","ram_status":"good","storage":"512GB","storage_status":"good","gpu":"10-Core GPU","gpu_status":"good"}',
        2, 'working', '2026-05-05')
      RETURNING equipment_id;
    `);

    const id1 = eq1.rows[0].equipment_id;
    const id2 = eq2.rows[0].equipment_id;
    const id3 = eq3.rows[0].equipment_id;
    const id4 = eq4.rows[0].equipment_id;
    const id5 = eq5.rows[0].equipment_id;

    console.log(`✓ Equipment seeded: ${id1}, ${id2}, ${id3}, ${id4}, ${id5}`);

    // 6. Seed Peripherals
    await pool.query(`
      INSERT INTO clams.peripherals (equipment_id, lab_id, item_name, category_id, brand, working_count, damaged_count)
      VALUES
        (${id1}, NULL, 'Apple Magic Keyboard', 2, 'Apple', 1, 0),
        (${id1}, NULL, 'Apple Magic Mouse', 2, 'Apple', 1, 0),
        (${id2}, NULL, 'Dell Keyboard', 2, 'Dell', 1, 0),
        (${id2}, NULL, 'Dell Mouse', 2, 'Dell', 1, 0),
        (${id3}, NULL, 'HP Keyboard', 2, 'HP', 1, 0),
        (${id3}, NULL, 'HP Mouse', 2, 'HP', 1, 0),
        (${id4}, NULL, 'Lenovo Keyboard', 2, 'Lenovo', 1, 0),
        (${id4}, NULL, 'Lenovo Mouse', 2, 'Lenovo', 1, 0),
        (${id5}, NULL, 'Apple Magic Keyboard', 2, 'Apple', 1, 0),
        (${id5}, NULL, 'Apple Magic Mouse', 2, 'Apple', 1, 0),
        (NULL, 1, 'Logitech MX Master Mouse', 2, 'Logitech', 15, 2),
        (NULL, 1, 'Generic Mechanical Keyboard', 2, 'Keychron', 10, 1),
        (NULL, 1, 'LG 24" Monitor', 3, 'LG', 5, 1),
        (NULL, 1, 'HyperX Cloud Headset', 4, 'HyperX', 8, 2),
        (NULL, 2, 'Logitech Mouse', 2, 'Logitech', 12, 1),
        (NULL, 2, 'HP Keyboard', 2, 'HP', 8, 0),
        (NULL, 3, 'Cisco USB Headset', 4, 'Cisco', 6, 1);
    `);
    console.log("✓ Peripherals seeded");

    // 7. Seed Borrow Transactions - FIXED: either equipment_id OR peripheral_id, not both NULL
    // First get a peripheral_id for peripheral transactions
    const peripheralRes = await pool.query(`
      SELECT peripheral_id FROM clams.peripherals WHERE equipment_id IS NULL LIMIT 1;
    `);
    const peripheralId = peripheralRes.rows[0]?.peripheral_id || 1;

    await pool.query(`
      INSERT INTO clams.borrow_transactions (instructor_id, borrower_name, equipment_id, peripheral_id, quantity, status, borrow_date, expected_return_date)
      VALUES 
        ('${adminId}', 'Student Tester', ${id1}, NULL, 1, 'borrowed', '2026-05-08', '2026-05-15'),
        ('${instructorId}', 'John Doe', ${id2}, NULL, 1, 'borrowed', '2026-05-09', '2026-05-16'),
        ('${instructorId}', 'Jane Smith', NULL, ${peripheralId}, 2, 'borrowed', '2026-05-07', '2026-05-14'),
        ('${adminId}', 'Mike Johnson', ${id4}, NULL, 1, 'returned', '2026-05-01', '2026-05-08');
    `);
    console.log("✓ Borrow transactions seeded");

    // 8. Seed Damage Reports
    await pool.query(`
      INSERT INTO clams.damage_reports (instructor_id, equipment_id, subject, description, status, created_at)
      VALUES 
        ('${adminId}', ${id1}, 'Battery Issue', 'The battery is draining too fast.', 'open', '2026-05-08'),
        ('${instructorId}', ${id3}, 'Screen Flickering', 'Screen flickers when charging.', 'in_progress', '2026-05-07'),
        ('${instructorId}', NULL, 'Broken Mouse', 'USB mouse left click not working.', 'resolved', '2026-05-05');
    `);
    console.log("✓ Damage reports seeded");

    // 9. Seed Activity Logs
    await pool.query(`
      INSERT INTO clams.activity_logs (user_id, action, table_affected, record_id, created_at)
      VALUES 
        ('${adminId}', 'LOGIN', 'users', 1, NOW()),
        ('${adminId}', 'CREATE', 'equipment', ${id1}, NOW()),
        ('${instructorId}', 'BORROW', 'borrow_transactions', 1, NOW()),
        ('${instructorId}', 'REPORT', 'damage_reports', 1, NOW());
    `);
    console.log("✓ Activity logs seeded");

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ SEEDING COMPLETED SUCCESSFULLY!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📝 Login Credentials:");
    console.log("   Admin:      admin / admin123");
    console.log("   Instructor: ins / ins123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    process.exit(0);
  } catch (err) {
    console.error("❌ SEEDING FAILED:", err);
    process.exit(1);
  }
};

seedDatabase();
