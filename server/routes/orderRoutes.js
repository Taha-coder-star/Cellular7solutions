const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderToPaid,
} = require('../controllers/orderController');

router.post('/', protect, placeOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/pay', protect, admin, updateOrderToPaid);

module.exports = router;
