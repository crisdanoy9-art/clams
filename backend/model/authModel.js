import pool from "../db.js";

// Find user for Login - Get ALL fields including password_hash
export const findUserByUsername = async (username) => {
  const query = `SELECT * FROM clams.users WHERE username = $1`;
  const result = await pool.query(query, [username]);
  console.log("findUserByUsername:", result.rows.length > 0 ? "User found" : "User not found");
  return result.rows[0];
};

// Find user by ID
export const findUserById = async (userId) => {
  const query = `SELECT user_id, id_number, username, first_name, last_name, email, role, created_at FROM clams.users WHERE user_id = $1 AND is_deleted = false`;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

// Create user for Register
export const createUser = async (userData) => {
  const {
    id_number,
    username,
    password_hash,
    first_name,
    last_name,
    email,
    role,
  } = userData;

  const query = `
    INSERT INTO clams.users (id_number, username, password_hash, first_name, last_name, email, role, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING user_id, username, role, id_number, first_name, last_name, email;
  `;

  const values = [
    id_number,
    username,
    password_hash,
    first_name || null,
    last_name || null,
    email || null,
    role || "instructor",
  ];
  
  const result = await pool.query(query, values);
  console.log("createUser: User created with ID:", result.rows[0]?.user_id);
  return result.rows[0];
};

// Update user last login
export const updateLastLogin = async (userId) => {
  const query = `UPDATE clams.users SET updated_at = CURRENT_TIMESTAMP WHERE user_id = $1`;
  await pool.query(query, [userId]);
};