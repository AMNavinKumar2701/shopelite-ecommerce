const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

exports.getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id })
        .populate('items.product', 'id title price image');

    if (!cart) {
        return res.status(200).json({
            success: true,
            data: {
                user: req.user._id,
                items: [],
                totalItems: 0,
                totalPrice: 0
            }
        });
    }

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(200).json({
        success: true,
        data: {
            ...cart.toObject(),
            totalItems,
            totalPrice: Math.round(totalPrice * 100) / 100
        }
    });
});

exports.addToCart = asyncHandler(async (req, res) => {
    const productId = Number(req.params.productId);

    if (isNaN(productId) || productId < 1) {
        throw ApiError.badRequest('Invalid product ID. Must be a positive integer.', 'INVALID_PRODUCT_ID');
    }

    const product = await Product.findOne({ id: productId });

    if (!product) {
        throw ApiError.notFound(
            `Product with ID ${productId} not found.`,
            'PRODUCT_NOT_FOUND'
        );
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: []
        });
        logger.info(`New cart created for user: ${req.user.email}`);
    }

    const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === product._id.toString()
    );

    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += 1;
        logger.debug(`Cart item quantity increased: Product ${productId} for user ${req.user.email}`);
    } else {
        cart.items.push({
            product: product._id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
        logger.debug(`New item added to cart: Product ${productId} for user ${req.user.email}`);
    }

    await cart.save();

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(200).json({
        success: true,
        message: `"${product.title}" added to cart.`,
        data: {
            ...cart.toObject(),
            totalItems,
            totalPrice: Math.round(totalPrice * 100) / 100
        }
    });
});

exports.removeFromCart = asyncHandler(async (req, res) => {
    const productId = Number(req.params.productId);

    if (isNaN(productId) || productId < 1) {
        throw ApiError.badRequest('Invalid product ID. Must be a positive integer.', 'INVALID_PRODUCT_ID');
    }

    const product = await Product.findOne({ id: productId });

    if (!product) {
        throw ApiError.notFound(
            `Product with ID ${productId} not found.`,
            'PRODUCT_NOT_FOUND'
        );
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw ApiError.notFound(
            'Your shopping cart is empty.',
            'CART_NOT_FOUND'
        );
    }

    const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === product._id.toString()
    );

    if (itemIndex === -1) {
        throw ApiError.notFound(
            `"${product.title}" is not in your cart.`,
            'ITEM_NOT_IN_CART'
        );
    }

    const item = cart.items[itemIndex];

    if (item.quantity > 1) {
        item.quantity -= 1;
        logger.debug(`Cart item quantity decreased: Product ${productId} for user ${req.user.email}`);
    } else {
        cart.items.splice(itemIndex, 1);
        logger.debug(`Cart item removed: Product ${productId} for user ${req.user.email}`);
    }

    await cart.save();

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(200).json({
        success: true,
        message: `"${product.title}" quantity updated in cart.`,
        data: {
            ...cart.toObject(),
            totalItems,
            totalPrice: Math.round(totalPrice * 100) / 100
        }
    });
});