const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger.warn(`Unauthorized access attempt: ${req.method} ${req.originalUrl} from IP ${req.ip}`);
            return next(ApiError.unauthorized('Access denied. No token provided.', 'NO_TOKEN'));
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return next(ApiError.unauthorized('Access denied. Token is malformed.', 'MALFORMED_TOKEN'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            logger.warn(`Token valid but user not found: ${decoded.id}`);
            return next(ApiError.unauthorized('User associated with this token no longer exists.', 'USER_NOT_FOUND'));
        }

        if (!user.isVerified) {
            return next(ApiError.forbidden('Please verify your email before accessing this resource.', 'EMAIL_NOT_VERIFIED'));
        }

        req.user = user;

        next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            logger.warn(`Expired token used: ${req.method} ${req.originalUrl}`);
            return next(ApiError.unauthorized('Token has expired. Please log in again.', 'TOKEN_EXPIRED'));
        }

        if (err.name === 'JsonWebTokenError') {
            logger.warn(`Invalid token detected: ${req.method} ${req.originalUrl}`);
            return next(ApiError.unauthorized('Invalid token. Please log in again.', 'INVALID_TOKEN'));
        }

        if (err.name === 'NotBeforeError') {
            return next(ApiError.unauthorized('Token is not yet active.', 'TOKEN_NOT_ACTIVE'));
        }

        logger.error(`Authentication error: ${err.message}`);
        return next(ApiError.internal('Authentication failed.'));
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(ApiError.unauthorized('Authentication required before authorization.'));
        }

        if (!roles.includes(req.user.role)) {
            logger.warn(
                `Access denied: User ${req.user.email} (role: ${req.user.role}) tried to access ${req.method} ${req.originalUrl} (allowed roles: ${roles.join(', ')})`
            );
            return next(ApiError.forbidden(
                `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}.`,
                'INSUFFICIENT_ROLE'
            ));
        }

        next();
    };
};

module.exports = { protect, authorize };