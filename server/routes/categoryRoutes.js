const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/requireAdmin');
const {
  getCategories,
  getCategoryById,
  getCategoryTree,
  resolveCategoryPath,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

router.get('/', getCategories);
router.get('/tree', getCategoryTree);
router.get('/resolve', resolveCategoryPath);
router.get('/:id', getCategoryById);
router.post('/', requireAdmin, createCategory);
router.put('/:id', requireAdmin, updateCategory);
router.delete('/:id', requireAdmin, deleteCategory);

module.exports = router;
