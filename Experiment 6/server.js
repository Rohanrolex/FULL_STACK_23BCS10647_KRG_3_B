const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const getAverageRating = require('./queries/aggregation');

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// 🧾 Sample route to test server
app.get('/', (req, res) => {
  res.send('E-commerce Catalog API Running...');
});

// 🧩 Route to add a product
app.post('/addProduct', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ⭐ Route to get average rating using aggregation
app.get('/averageRating/:id', async (req, res) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.id);
    const result = await getAverageRating(productId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(3000, () => console.log('✅ Server running on port 3000'));
