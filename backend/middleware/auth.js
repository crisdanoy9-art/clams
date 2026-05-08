import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Get token from Header (Format: Bearer <token>)
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ msg: "No token provided, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user info (like user_id) to the request object
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
