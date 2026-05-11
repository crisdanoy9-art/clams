import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Get token from Header (Format: Bearer <token>)
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ 
      success: false,
      msg: "No token provided, authorization denied" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure user_id is parsed as integer (since database uses SERIAL)
    req.user = {
      user_id: parseInt(decoded.user_id),
      username: decoded.username,
      role: decoded.role
    };
    
    console.log(`✅ Token verified - User: ${req.user.username} (ID: ${req.user.user_id}, Role: ${req.user.role})`);
    
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ 
      success: false,
      msg: "Token is not valid or has expired" 
    });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      msg: "Access denied. Admin privileges required." 
    });
  }
};

// Middleware to check if user is instructor (or admin)
export const isInstructor = (req, res, next) => {
  if (req.user && (req.user.role === "instructor" || req.user.role === "admin")) {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      msg: "Access denied. Instructor privileges required." 
    });
  }
};