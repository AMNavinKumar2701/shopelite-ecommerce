const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const redis = require('../config/redis');
const logger = require('../utils/logger');

const CACHE_TTL = 3600;
const CACHE_PREFIX = 'products';

const invalidateProductCache = async () => {
    try {
        const keys = await redis.keys(`${CACHE_PREFIX}:*`);

        if (keys.length > 0) {
            await redis.del(...keys);
            logger.info(`Product cache invalidated: ${keys.length} keys cleared`);
        }
    } catch (error) {
        logger.error(`Cache invalidation failed: ${error.message}`);
    }
};

exports.getProducts = asyncHandler(async (req, res) => {
    const cacheKey = `${CACHE_PREFIX}:all:${JSON.stringify(req.query)}`;

    try {
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            logger.debug('Products served from Redis cache');
            return res.status(200).json({
                success: true,
                fromCache: true,
                count: JSON.parse(cachedData).length,
                data: JSON.parse(cachedData)
            });
        }
    } catch (cacheError) {
        logger.warn(`Redis cache read failed: ${cacheError.message}`);
    }

    const products = await Product.find().sort({ id: 1 });

    try {
        await redis.set(cacheKey, JSON.stringify(products), 'EX', CACHE_TTL);
        logger.debug('Products cached in Redis');
    } catch (cacheError) {
        logger.warn(`Redis cache write failed: ${cacheError.message}`);
    }

    res.status(200).json({
        success: true,
        fromCache: false,
        count: products.length,
        data: products
    });
});

exports.getProduct = asyncHandler(async (req, res) => {
    const productId = Number(req.params.id);

    if (isNaN(productId) || productId < 1) {
        throw ApiError.badRequest('Invalid product ID. Must be a positive integer.', 'INVALID_PRODUCT_ID');
    }

    const cacheKey = `${CACHE_PREFIX}:single:${productId}`;

    try {
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            logger.debug(`Product ${productId} served from cache`);
            return res.status(200).json({
                success: true,
                fromCache: true,
                data: JSON.parse(cachedData)
            });
        }
    } catch (cacheError) {
        logger.warn(`Redis cache read failed for product ${productId}: ${cacheError.message}`);
    }

    const product = await Product.findOne({ id: productId });

    if (!product) {
        throw ApiError.notFound(
            `Product with ID ${productId} not found.`,
            'PRODUCT_NOT_FOUND'
        );
    }

    try {
        await redis.set(cacheKey, JSON.stringify(product), 'EX', CACHE_TTL);
    } catch (cacheError) {
        logger.warn(`Redis cache write failed for product ${productId}: ${cacheError.message}`);
    }

    res.status(200).json({
        success: true,
        fromCache: false,
        data: product
    });
});

exports.createProduct = asyncHandler(async (req, res) => {
    if (!req.body.title || !req.body.price) {
        throw ApiError.badRequest('Product title and price are required.', 'MISSING_REQUIRED_FIELDS');
    }

    const lastProduct = await Product.findOne().sort({ id: -1 });

    let newId = 1;
    if (lastProduct) {
        newId = lastProduct.id + 1;
    }

    const product = await Product.create({
        id: newId,
        title: req.body.title,
        price: req.body.price,
        description: req.body.description || '',
        category: req.body.category || '',
        image: req.body.image || '',
        rating: req.body.rating || { rate: 0, count: 0 }
    });

    await invalidateProductCache();

    logger.info(`Product created: ID ${newId} — "${product.title}" by admin ${req.user.email}`);

    res.status(201).json({
        success: true,
        message: 'Product created successfully.',
        data: product
    });
});

exports.updateProduct = asyncHandler(async (req, res) => {
    const productId = Number(req.params.id);

    if (isNaN(productId) || productId < 1) {
        throw ApiError.badRequest('Invalid product ID. Must be a positive integer.', 'INVALID_PRODUCT_ID');
    }

    if (Object.keys(req.body).length === 0) {
        throw ApiError.badRequest('No update data provided.', 'EMPTY_UPDATE');
    }

    const product = await Product.findOneAndUpdate(
        { id: productId },
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!product) {
        throw ApiError.notFound(
            `Product with ID ${productId} not found.`,
            'PRODUCT_NOT_FOUND'
        );
    }

    await invalidateProductCache();

    logger.info(`Product updated: ID ${productId} by admin ${req.user.email}`);

    res.status(200).json({
        success: true,
        message: 'Product updated successfully.',
        data: product
    });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
    const productId = Number(req.params.id);

    if (isNaN(productId) || productId < 1) {
        throw ApiError.badRequest('Invalid product ID. Must be a positive integer.', 'INVALID_PRODUCT_ID');
    }

    const product = await Product.findOneAndDelete({ id: productId });

    if (!product) {
        throw ApiError.notFound(
            `Product with ID ${productId} not found.`,
            'PRODUCT_NOT_FOUND'
        );
    }

    await invalidateProductCache();

    logger.info(`Product deleted: ID ${productId} — "${product.title}" by admin ${req.user.email}`);

    res.status(200).json({
        success: true,
        message: `Product "${product.title}" (ID: ${productId}) deleted successfully.`
    });
});