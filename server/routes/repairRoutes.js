const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/requireAdmin');
const {
  getRepairRequests,
  getRepairRequestById,
  updateRepair,
  deleteRepairRequest,
} = require('../controllers/repairController');

// The public enquiry flow now opens WhatsApp. Preserve legacy records and admin
// read/update endpoints, but do not create new repair records through this API.
router.post('/', (_req, res) => res.status(410).json({ message: 'Repair enquiries now go through WhatsApp.' }));
router.get('/', requireAdmin, getRepairRequests);
router.get('/:id', requireAdmin, getRepairRequestById);
router.put('/:id', requireAdmin, updateRepair);
router.delete('/:id', requireAdmin, deleteRepairRequest);

module.exports = router;
