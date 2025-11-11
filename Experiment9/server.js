const express = require("express");
const { generateToken } = require("./utils/jwtUtils");
const verifyToken = require("./middleware/verifyToken");

const app = express();
app.use(express.json());

// 🧑 Dummy user data for testing
const users = [
  { id: 1, name: "Alice", email: "alice@example.com", password: "alice123" },
  { id: 2, name: "Bob", email: "bob@example.com", password: "bob123" },
];

// ✅ Login Route — Generates JWT token
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid Credentials" });

  const token = generateToken({ id: user.id, name: user.name, email: user.email });
  res.json({ message: "Login Successful", token });
});

// 🔒 Protected Route — Accessible only with valid token
app.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}, this is your dashboard.` });
});

// 🌐 Start the Server
app.listen(3000, () => console.log("✅ Server running on port 3000"));
