const Product = require('../models/Product');

const getAverageRating = async (productId) => {
  const result = await Product.aggregate([
    { $match: { _id: productId } },
    { $unwind: "$reviews" },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$reviews.rating" },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (result.length === 0) {
    return { message: "No reviews yet" };
  }

  return {
    averageRating: result[0].avgRating.toFixed(2),
    totalReviews: result[0].totalReviews
  };
};

module.exports = getAverageRating;
