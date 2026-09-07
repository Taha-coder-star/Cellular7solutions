const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/requireAdmin');
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
router.post('/', requireAdmin, upload.array('images', 5), createProduct);
router.put('/:id', requireAdmin, upload.array('images', 5), updateProduct);
router.delete('/:id/images', requireAdmin, deleteProductImage);
router.delete('/:id', requireAdmin, deleteProduct);

module.exports = router;
