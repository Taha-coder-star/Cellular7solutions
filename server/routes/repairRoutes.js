const express = require('express');
const router = express.Router();
const { optionalProtect, protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const {
  createRepairRequest,
  getRepairRequests,
  getMyRepairRequests,
  getRepairRequestById,
  updateRepair,
} = require('../controllers/repairController');

router.post('/', optionalProtect, createRepairRequest);
router.get('/', protect, admin, getRepairRequests);
router.get('/my', protect, getMyRepairRequests);
router.get('/:id', protect, admin, getRepairRequestById);
router.put('/:id', protect, admin, updateRepair);

module.exports = router;
