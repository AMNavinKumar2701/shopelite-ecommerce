const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errorCode = err.errorCode || null;
    let errors = null;

    if (err.name === 'ValidationError') {
        statusCode = 422;
        const fieldErrors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message
        }));
        message = 'Validation failed';
        errors = fieldErrors;
        errorCode = 'VALIDATION_ERROR';
    }

    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid value for ${err.path}: "${err.value}"`;
        errorCode = 'INVALID_ID';
    }

    if (err.code === 11000) {
        statusCode = 409;
        const duplicateField = Object.keys(err.keyValue).join(', ');
        message = `Duplicate value for: ${duplicateField}. This value already exists.`;
        errorCode = 'DUPLICATE_KEY';
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid authentication token';
        errorCode = 'INVALID_TOKEN';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Authentication token has expired. Please log in again.';
        errorCode = 'TOKEN_EXPIRED';
    }

    if (err.type === 'entity.parse.failed') {
        statusCode = 400;
        message = 'Invalid JSON in request body. Please check your request format.';
        errorCode = 'INVALID_JSON';
    }

    if (err.type === 'entity.too.large') {
        statusCode = 413;
        message = 'Request payload is too large. Maximum allowed size exceeded.';
        errorCode = 'PAYLOAD_TOO_LARGE';
    }

    if (statusCode >= 500) {
        logger.error(`[${statusCode}] ${req.method} ${req.originalUrl} — ${message}`, {
            stack: err.stack,
            ip: req.ip,
            userId: req.user ? req.user._id : 'unauthenticated'
        });
    } else {
        logger.warn(`[${statusCode}] ${req.method} ${req.originalUrl} — ${message}`);
    }

    const response = {
        success: false,
        statusCode,
        message,
        ...(errorCode && { errorCode }),
        ...(errors && { errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    res.status(statusCode).json(response);
};

module.exports = errorHandler;