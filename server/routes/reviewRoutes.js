const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { createReview, getProductReviews, deleteReview } = require('../controllers/reviewController');

router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;
