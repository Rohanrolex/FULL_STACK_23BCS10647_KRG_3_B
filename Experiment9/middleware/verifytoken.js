const jwt = require("jsonwebtoken");
const { secretKey } = require("../utils/jwtUtils");

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified; // attach decoded user info
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
}

module.exports = verifyToken;
