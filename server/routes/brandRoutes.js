const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/requireAdmin');
const {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../controllers/brandController');

router.get('/', getBrands);
router.get('/:id', getBrandById);
router.post('/', requireAdmin, createBrand);
router.put('/:id', requireAdmin, updateBrand);
router.delete('/:id', requireAdmin, deleteBrand);

module.exports = router;
