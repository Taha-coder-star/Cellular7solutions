const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getProducts,
  getProductFacets,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/facets', getProductFacets);
router.get('/:id', getProductById);
router.post('/', protect, admin, upload.array('images', 5), createProduct);
router.put('/:id', protect, admin, upload.array('images', 5), updateProduct);
router.delete('/:id/images', protect, admin, deleteProductImage);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
