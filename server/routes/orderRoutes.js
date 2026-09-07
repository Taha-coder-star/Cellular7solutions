const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/requireAdmin');
const { formLimiter } = require('../middleware/rateLimit');
const {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderToPaid,
} = require('../controllers/orderController');

router.post('/', formLimiter, placeOrder);
router.get('/', requireAdmin, getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', requireAdmin, updateOrderStatus);
router.put('/:id/pay', requireAdmin, updateOrderToPaid);

module.exports = router;
