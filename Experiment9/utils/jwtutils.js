const jwt = require("jsonwebtoken");
const secretKey = "yourSecretKey"; // ⚠️ In real apps, store in environment variable

// Generate a JWT for a given user
function generateToken(user) {
  return jwt.sign(user, secretKey, { expiresIn: "1h" }); // Token valid for 1 hour
}

module.exports = { generateToken, secretKey };
