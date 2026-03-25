const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const generalLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded: IP ${req.ip} on ${req.method} ${req.originalUrl}`);

        res.status(429).json({
            success: false,
            statusCode: 429,
            message: 'Too many requests. Please try again later.',
            errorCode: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 1000)
        });
    }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Auth rate limit exceeded: IP ${req.ip} on ${req.method} ${req.originalUrl}`);

        res.status(429).json({
            success: false,
            statusCode: 429,
            message: 'Too many authentication attempts. Please try again in 15 minutes.',
            errorCode: 'AUTH_RATE_LIMIT_EXCEEDED',
            retryAfter: 900
        });
    }
});

module.exports = { generalLimiter, authLimiter };