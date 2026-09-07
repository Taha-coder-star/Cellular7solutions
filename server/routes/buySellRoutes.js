const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/requireAdmin');
const { honeypot } = require('../middleware/honeypot');
const { formLimiter } = require('../middleware/rateLimit');
const {
  createBuySellRequest,
  getBuySellRequests,
  getBuySellRequestById,
  updateBuySellStatus,
  deleteBuySellRequest,
} = require('../controllers/buySellController');

router.post('/', formLimiter, honeypot, createBuySellRequest);
router.get('/', requireAdmin, getBuySellRequests);
router.get('/:id', requireAdmin, getBuySellRequestById);
router.put('/:id/status', requireAdmin, updateBuySellStatus);
router.delete('/:id', requireAdmin, deleteBuySellRequest);

module.exports = router;
