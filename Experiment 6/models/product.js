const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categories: [String],

  variants: [{
    color: String,
    size: String,
    price: Number,
    stock: Number
  }],

  reviews: [{
    user: mongoose.ObjectId,
    rating: { type: Number, min: 1, max: 5 },
    comment: String
  }]
});

module.exports = mongoose.model('Product', productSchema);
