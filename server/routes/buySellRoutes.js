const express = require('express');
const router = express.Router();
const { optionalProtect } = require('../middleware/authMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const {
  createBuySellRequest,
  getBuySellRequests,
  getBuySellRequestById,
  updateBuySellStatus,
} = require('../controllers/buySellController');

router.post('/', optionalProtect, createBuySellRequest);
router.get('/', protect, admin, getBuySellRequests);
router.get('/:id', protect, admin, getBuySellRequestById);
router.put('/:id/status', protect, admin, updateBuySellStatus);

module.exports = router;
