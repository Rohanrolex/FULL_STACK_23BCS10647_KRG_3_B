const express = require("express");
const { generateToken } = require("./utils/jwtUtils");
const verifyToken = require("./middleware/verifyToken");
const authorizeRoles = require("./middleware/authorizeRoles");

const app = express();
app.use(express.json());

// 👥 Dummy Users
const users = [
  { id: 1, name: "Amogh", email: "amogh@example.com", password: "admin123", role: "admin" },
  { id: 2, name: "Riya", email: "riya@example.com", password: "mod123", role: "moderator" },
  { id: 3, name: "Rahul", email: "rahul@example.com", password: "user123", role: "user" },
];

// ✅ Login Route (Generates JWT)
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid Credentials" });

  const token = generateToken({ id: user.id, name: user.name, role: user.role });
  res.json({ message: "Login Successful", token });
});

// 🔒 Admin-only Route
app.get("/admin-panel", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.send(`Welcome ${req.user.name}, this is the Admin Panel.`);
});

// 🧩 Moderator-only Route
app.get("/moderator-zone", verifyToken, authorizeRoles("moderator", "admin"), (req, res) => {
  res.send(`Welcome ${req.user.name}, this is the Moderator Zone.`);
});

// 👤 User Route (Accessible to all)
app.get("/user-dashboard", verifyToken, authorizeRoles("user", "moderator", "admin"), (req, res) => {
  res.send(`Welcome ${req.user.name}, this is your User Dashboard.`);
});

app.listen(3000, () => console.log("✅ RBAC Server running on port 3000"));
