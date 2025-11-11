const jwt = require("jsonwebtoken");
const secretKey = "yourSecretKey";

// Generate a JWT with user role embedded in payload
function generateToken(user) {
  return jwt.sign(user, secretKey, { expiresIn: "1h" });
}

module.exports = { generateToken, secretKey };
