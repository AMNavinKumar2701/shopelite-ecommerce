const express = require('express');

const router = express.Router();

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/authMiddleware');

const {
    createProductValidator,
    updateProductValidator,
    productIdValidator
} = require('../utils/validators');

const validateRequest = require('../middleware/validateRequest');

router.get('/', getProducts);

router.get('/:id', productIdValidator, validateRequest, getProduct);

router.post('/', protect, authorize('admin'), createProductValidator, validateRequest, createProduct);

router.put('/:id', protect, authorize('admin'), productIdValidator, updateProductValidator, validateRequest, updateProduct);

router.delete('/:id', protect, authorize('admin'), productIdValidator, validateRequest, deleteProduct);

module.exports = router;