const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // ⚠️ Replace <username>, <password>, and <dbname> with your MongoDB Atlas credentials
    await mongoose.connect('mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority');
    console.log('🌿 MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
