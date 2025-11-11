const express = require("express");
const connectDB = require("./config/db");
const { transferMoney } = require("./controllers/transactionController");
const User = require("./models/User");

const app = express();
app.use(express.json());

// Connect MongoDB
connectDB();

// ✅ Route to create user
app.post("/createUser", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 💸 Route to transfer money (uses transaction)
app.post("/transfer", transferMoney);

// 📊 Route to check all users' balances
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Start server
app.listen(3000, () => console.log("✅ Server running on port 3000"));
