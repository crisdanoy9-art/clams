import pool from "../db.js";

// Find user for Login
export const findUserByUsername = async (username) => {
  const query = `SELECT * FROM clams.users WHERE username = $1`;
  const result = await pool.query(query, [username]);
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
    INSERT INTO clams.users (id_number, username, password_hash, first_name, last_name, email, role)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING user_id, username, role;
  `;

  const values = [
    id_number,
    username,
    password_hash,
    first_name,
    last_name,
    email,
    role || "instructor",
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};
