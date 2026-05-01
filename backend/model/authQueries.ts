// model/authQueries.ts
import pool from "../db";

export const findUser = async (username: string) => {
  const result = await pool.query(
    `SELECT * FROM clams.users WHERE username = $1`,
    [username],
  );
  return result.rows[0];
};

// model/authQueries.ts
export const createUser = async (data: {
  id_number: string;
  username: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  profile_img?: string;
}) => {
  const result = await pool.query(
    `INSERT INTO clams.users 
      (id_number, username, password_hash, first_name, last_name, email, role, profile_img)
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING user_id, username, role`,
    [
      data.id_number,
      data.username,
      data.password_hash,
      data.first_name,
      data.last_name,
      data.email,
      data.role,
      data.profile_img ?? null,
    ],
  );
  return result.rows[0];
};
