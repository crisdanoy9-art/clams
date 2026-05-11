import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsername, createUser, updateLastLogin, findUserById } from "../model/authModel.js";
import { logActivity } from "../model/logsModel.js";
import pool from "../db.js";

const SALT_ROUNDS = 10;

// ============================================================
// REGISTER - Create new user account
// ============================================================
export const Register = async (req, res) => {
  try {
    // Support both body formats: direct or wrapped in 'data'
    let bodyData = req.body;
    if (req.body.data) {
      bodyData = req.body.data;
    }

    const { id_number, username, password, first_name, last_name, email, role } = bodyData;

    console.log("\n========== REGISTER ATTEMPT ==========");
    console.log("Username:", username);
    console.log("ID Number:", id_number);
    console.log("Role provided:", role);

    // Validation - Check required fields
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        error: "Username and password are required"
      });
    }

    if (!id_number) {
      return res.status(400).json({ 
        success: false,
        error: "ID Number is required" 
      });
    }

    // Check if username already exists
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      console.log("Username already exists:", username);
      return res.status(409).json({ 
        success: false,
        error: "Username already exists" 
      });
    }

    // Check if id_number already exists
    const existingIdNumber = await pool.query(
      "SELECT * FROM clams.users WHERE id_number = $1",
      [id_number]
    );
    if (existingIdNumber.rows.length > 0) {
      console.log("ID Number already exists:", id_number);
      return res.status(409).json({ 
        success: false,
        error: "ID Number already exists" 
      });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await pool.query(
        "SELECT * FROM clams.users WHERE email = $1",
        [email]
      );
      if (existingEmail.rows.length > 0) {
        console.log("Email already exists:", email);
        return res.status(409).json({ 
          success: false,
          error: "Email already exists" 
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    console.log("Password hashed successfully");

    // Determine role - if not provided, default to 'instructor'
    // If provided, ensure it's either 'admin' or 'instructor'
    let userRole = 'instructor';
    if (role === 'admin') {
      userRole = 'admin';
    } else if (role === 'instructor') {
      userRole = 'instructor';
    } else {
      userRole = 'instructor'; // default
    }
    
    console.log("Final role to save:", userRole);

    // Create user data object
    const userData = {
      id_number,
      username,
      password_hash: hashedPassword,
      first_name: first_name || null,
      last_name: last_name || null,
      email: email || null,
      role: userRole
    };

    // Insert user into database
    const newUser = await createUser(userData);
    console.log("User created with ID:", newUser.user_id);
    console.log("User role in database:", newUser.role);

    // Log the registration activity
    await logActivity(newUser.user_id, "REGISTER", "users", newUser.user_id);

    // Return success response (without password)
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        user_id: newUser.user_id,
        id_number: id_number,
        username: newUser.username,
        first_name: first_name || null,
        last_name: last_name || null,
        email: email || null,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Registration failed: " + error.message 
    });
  }
};

// ============================================================
// LOGIN - Authenticate user
// ============================================================
export const Login = async (req, res) => {
  try {
    // Support both body formats: direct or wrapped in 'data'
    let bodyData = req.body;
    if (req.body.data) {
      bodyData = req.body.data;
    }

    const { username, password } = bodyData;

    console.log("\n========== LOGIN ATTEMPT ==========");
    console.log("Username:", username);

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        error: "Username and password are required" 
      });
    }

    // Find user by username
    const user = await findUserByUsername(username);

    if (!user) {
      console.log("User not found in database");
      return res.status(401).json({ 
        success: false,
        error: "Invalid username or password" 
      });
    }

    console.log("User found:", user.username);
    console.log("User role from database:", user.role);

    // Check if user is soft deleted
    if (user.is_deleted === true) {
      console.log("Account is deactivated");
      return res.status(401).json({ 
        success: false,
        error: "Account has been deactivated. Contact administrator." 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Password does NOT match");
      return res.status(401).json({ 
        success: false,
        error: "Invalid username or password" 
      });
    }

    console.log("Password matched successfully!");

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from .env file");
      return res.status(500).json({ 
        success: false,
        error: "Server configuration error" 
      });
    }

    // Generate JWT token with role included
    const token = jwt.sign(
      { 
        user_id: user.user_id, 
        username: user.username,
        role: user.role  // IMPORTANT: role must be in token
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("JWT token generated with role:", user.role);

    // Update last login
    await updateLastLogin(user.user_id);

    // Log login activity
    await logActivity(user.user_id, "LOGIN", "users", user.user_id);

    // Return user data (without password hash)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        id_number: user.id_number,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role  // IMPORTANT: role must be returned
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Login failed: " + error.message 
    });
  }
};

// ============================================================
// LOGOUT - Log user out
// ============================================================
export const Logout = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    
    if (userId) {
      await logActivity(userId, "LOGOUT", "users", userId);
      console.log("User logged out:", userId);
    }
    
    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
    
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================================
// GET CURRENT USER PROFILE
// ============================================================
export const getMe = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const user = await findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    console.log("Get user profile:", user.username, "Role:", user.role);
    
    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// ============================================================
// CHANGE PASSWORD - Supports both snake_case and camelCase
// ============================================================
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    // Support both snake_case and camelCase formats
    let currentPassword = req.body.currentPassword || req.body.current_password;
    let newPassword = req.body.newPassword || req.body.new_password;

    console.log("\n========== CHANGE PASSWORD ==========");
    console.log("User ID:", userId);
    console.log("Current password provided:", currentPassword ? "Yes" : "No");
    console.log("New password provided:", newPassword ? "Yes" : "No");

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        error: "Current password and new password are required" 
      });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({ 
        success: false,
        error: "Password must be at least 4 characters" 
      });
    }

    // Get user's current password hash
    const userResult = await pool.query(
      "SELECT password_hash FROM clams.users WHERE user_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    // Verify current password
    const isValid = await bcrypt.compare(
      currentPassword,
      userResult.rows[0].password_hash
    );

    if (!isValid) {
      console.log("Current password is incorrect");
      return res.status(401).json({ 
        success: false,
        error: "Current password is incorrect" 
      });
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password in database
    await pool.query(
      "UPDATE clams.users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2",
      [newHash, userId]
    );

    // Log password change
    await logActivity(userId, "CHANGE_PASSWORD", "users", userId);

    console.log("Password changed successfully");

    res.json({ 
      success: true, 
      message: "Password changed successfully" 
    });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};