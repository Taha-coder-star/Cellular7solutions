const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/requireAdmin');
const { honeypot } = require('../middleware/honeypot');
const { formLimiter } = require('../middleware/rateLimit');
const { createReview, getProductReviews, deleteReview } = require('../controllers/reviewController');

router.post('/', formLimiter, honeypot, createReview);
router.get('/product/:productId', getProductReviews);
router.delete('/:id', requireAdmin, deleteReview);

module.exports = router;
