const express = require("express");
const connectDB = require("./config/db");
const { register, login } = require("./controllers/authController");
const bankingRoutes = require("./routes/bankingRoutes");

const app = express();
app.use(express.json());

// Connect MongoDB
connectDB();

// Public routes
app.post("/register", register);
app.post("/login", login);

// Protected banking routes
app.use("/bank", bankingRoutes);

// Server start
app.listen(3000, () => console.log("✅ Server running on port 3000"));
