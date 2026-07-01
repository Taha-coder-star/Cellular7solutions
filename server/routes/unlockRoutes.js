const express = require('express');
const router = express.Router();
const { optionalProtect, protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const {
  createUnlockRequest,
  getUnlockRequests,
  getUnlockRequestById,
  updateUnlockStatus,
} = require('../controllers/unlockController');

router.post('/', optionalProtect, createUnlockRequest);
router.get('/', protect, admin, getUnlockRequests);
router.get('/:id', protect, admin, getUnlockRequestById);
router.put('/:id/status', protect, admin, updateUnlockStatus);

module.exports = router;
