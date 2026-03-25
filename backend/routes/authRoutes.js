const express = require('express');

const router = express.Router();

const { register, verifyOtp, login } = require('../controllers/authController');

const { registerValidator, verifyOtpValidator, loginValidator } = require('../utils/validators');

const validateRequest = require('../middleware/validateRequest');

const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, registerValidator, validateRequest, register);

router.post('/verify-otp', authLimiter, verifyOtpValidator, validateRequest, verifyOtp);

router.post('/login', authLimiter, loginValidator, validateRequest, login);

module.exports = router;