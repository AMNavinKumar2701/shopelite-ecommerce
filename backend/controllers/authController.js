const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const logger = require('../utils/logger');

exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
        throw ApiError.conflict(
            'An account with this email already exists. Please use a different email or log in.',
            'EMAIL_ALREADY_EXISTS'
        );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: req.body.role || 'user'
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email: email.toLowerCase() });

    await Otp.create({ email: email.toLowerCase(), otp });

    await sendEmail(email, otp);

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email for the OTP verification code.',
        data: {
            email: user.email,
            name: user.name
        }
    });
});

exports.verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const otpRecord = await Otp.findOne({
        email: email.toLowerCase(),
        otp: otp.toString()
    });

    if (!otpRecord) {
        throw ApiError.badRequest(
            'Invalid or expired OTP. Please request a new verification code.',
            'INVALID_OTP'
        );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        await Otp.deleteOne({ email: email.toLowerCase() });
        throw ApiError.notFound('User account not found.', 'USER_NOT_FOUND');
    }

    if (user.isVerified) {
        await Otp.deleteOne({ email: email.toLowerCase() });
        return res.status(200).json({
            success: true,
            message: 'Email is already verified. You can log in.'
        });
    }

    await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { isVerified: true }
    );

    await Otp.deleteOne({ email: email.toLowerCase() });

    logger.info(`Email verified: ${email}`);

    res.status(200).json({
        success: true,
        message: 'Email verified successfully. You can now log in.'
    });
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        throw ApiError.unauthorized(
            'Invalid email or password.',
            'INVALID_CREDENTIALS'
        );
    }

    if (!user.isVerified) {
        throw ApiError.forbidden(
            'Please verify your email before logging in. Check your inbox for the OTP.',
            'EMAIL_NOT_VERIFIED'
        );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        logger.warn(`Failed login attempt for: ${email} from IP: ${req.ip}`);
        throw ApiError.unauthorized(
            'Invalid email or password.',
            'INVALID_CREDENTIALS'
        );
    }

    const token = generateToken(user);

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    });
});