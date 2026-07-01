const Review = require('../models/Review');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

const createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;

    if (!product || !rating || !comment) {
      return res.status(400).json({ message: 'product, rating, and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'rating must be between 1 and 5' });
    }

    // Verified purchase check: find all orders belonging to this user, then confirm
    // at least one OrderItem in those orders references the target product.
    const userOrders = await Order.find({ user: req.user.id }, '_id');
    const orderIds = userOrders.map((o) => o._id);
    const purchased = await OrderItem.findOne({ product, order: { $in: orderIds } });

    if (!purchased) {
      return res.status(403).json({ message: 'You can only review products you have purchased' });
    }

    const review = new Review({
      user: req.user.id,
      product,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    // Mongoose duplicate key error — compound index {user, product} already exists
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You have already reviewed this product' });
    }
    console.error('createReview:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error('getProductReviews:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('deleteReview:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createReview, getProductReviews, deleteReview };
