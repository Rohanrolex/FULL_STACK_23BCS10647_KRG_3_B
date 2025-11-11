const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// 🔒 Protected Route: Check Balance
router.get("/balance", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ balance: user.balance });
});

// 🔒 Protected Route: Transfer Money
router.post("/transfer", auth, async (req, res) => {
  const { recipientEmail, amount } = req.body;

  const sender = await User.findById(req.userId);
  const recipient = await User.findOne({ email: recipientEmail });

  if (!recipient) return res.status(404).json({ error: "Recipient not found" });
  if (sender.balance < amount) return res.status(400).json({ error: "Insufficient balance" });

  sender.balance -= amount;
  recipient.balance += amount;

  await sender.save();
  await recipient.save();

  res.json({ message: `Transferred ₹${amount} to ${recipientEmail}` });
});

module.exports = router;
 
