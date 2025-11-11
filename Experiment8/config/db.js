const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // ⚠️ Replace with your own MongoDB Replica Set connection string
    await mongoose.connect("mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority");
    console.log("🌿 MongoDB connected successfully (Replica Set enabled)");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
