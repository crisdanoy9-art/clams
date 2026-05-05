import pool from "../db";
import bcrypt from "bcryptjs";

async function createAdmin() {
  try {
    const password_hash = await bcrypt.hash("admin", 10);

    await pool.query(
      `
      INSERT INTO clams.users (
        id_number, username, password_hash, first_name, last_name, email, role
      ) VALUES (
        '201234', 'admin', $1, 'Admin', 'User', 'admin@gmail.com', 'admin'
      ) ON CONFLICT (username) DO NOTHING;
    `,
      [password_hash],
    );

    console.log("Admin created — username: admin, password: admin");
  } catch (e: any) {
    console.error("Error:", e.message);
  } finally {
    process.exit(0);
  }
}

createAdmin();
