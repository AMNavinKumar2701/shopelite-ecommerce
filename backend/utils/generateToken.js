const jwt = require('jsonwebtoken');
const ApiError = require('./ApiError');

const generateToken = (user) => {
    if (!user || !user._id) {
        throw ApiError.internal('Cannot generate token: invalid user object');
    }

    if (!process.env.JWT_SECRET) {
        throw ApiError.internal('JWT_SECRET is not configured');
    }

    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        }
    );
};

module.exports = generateToken;