const Review = require('../models/Review');

const createReview = async (req, res) => {
  try {
    const { name, email, product, rating, comment } = req.body;

    if (!name || !email || !product || !rating || !comment) {
      return res.status(400).json({ message: 'name, email, product, rating, and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'rating must be between 1 and 5' });
    }

    const review = new Review({ name, email, product, rating, comment });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error('createReview:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
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
