const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/requireAdmin');
const { honeypot } = require('../middleware/honeypot');
const { formLimiter } = require('../middleware/rateLimit');
const {
  createRepairRequest,
  getRepairRequests,
  getRepairRequestById,
  updateRepair,
  deleteRepairRequest,
} = require('../controllers/repairController');

router.post('/', formLimiter, honeypot, createRepairRequest);
router.get('/', requireAdmin, getRepairRequests);
router.get('/:id', requireAdmin, getRepairRequestById);
router.put('/:id', requireAdmin, updateRepair);
router.delete('/:id', requireAdmin, deleteRepairRequest);

module.exports = router;
