import pool from "../db";
import bcrypt from "bcryptjs";

async function seedDatabase() {
  try {
    // 1. Create Admin
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
    console.log(" Admin verified/created.");

    const categories = [
      "Desktop (Tower)",
      "All-in-One PC",
      "Laptop",
      "Workstation",
      "Thin Client",
      "Rack Server",
      "Tower Server",
    ];

    console.log(" Seeding categories...");

    // 3. Insert Categories one-by-one (The "Failsafe" way)
    for (const cat of categories) {
      await pool.query(
        `INSERT INTO clams.categories (category_name) 
         VALUES ($1) 
         ON CONFLICT DO NOTHING`, // Removed the explicit name here to avoid the error
        [cat],
      );
    }

    console.log("All categories seeded.");
  } catch (e: any) {
    console.error(" Error:", e.message);
  } finally {
    process.exit(0);
  }
}

seedDatabase();
