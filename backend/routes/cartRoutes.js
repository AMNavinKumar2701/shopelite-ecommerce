const express = require('express');

const router = express.Router();

const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

const { protect, authorize } = require('../middleware/authMiddleware');

const { cartProductIdValidator } = require('../utils/validators');

const validateRequest = require('../middleware/validateRequest');

router.get('/', protect, authorize('user'), getCart);

router.put('/add/:productId', protect, authorize('user'), cartProductIdValidator, validateRequest, addToCart);

router.delete('/remove/:productId', protect, authorize('user'), cartProductIdValidator, validateRequest, removeFromCart);

module.exports = router;