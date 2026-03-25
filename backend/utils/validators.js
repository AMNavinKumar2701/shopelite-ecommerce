const { body, param } = require('express-validator');

const registerValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/\d/).withMessage('Password must contain at least one number'),

    body('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Role must be either "user" or "admin"')
];

const verifyOtpValidator = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('otp')
        .trim()
        .notEmpty().withMessage('OTP is required')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits')
        .isNumeric().withMessage('OTP must contain only numbers')
];

const loginValidator = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
];

const createProductValidator = [
    body('title')
        .trim()
        .notEmpty().withMessage('Product title is required')
        .isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),

    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

    body('category')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Category cannot exceed 100 characters'),

    body('image')
        .optional()
        .trim()
        .isURL().withMessage('Image must be a valid URL'),

    body('rating.rate')
        .optional()
        .isFloat({ min: 0, max: 5 }).withMessage('Rating rate must be between 0 and 5'),

    body('rating.count')
        .optional()
        .isInt({ min: 0 }).withMessage('Rating count must be a non-negative integer')
];

const updateProductValidator = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),

    body('price')
        .optional()
        .isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

    body('category')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Category cannot exceed 100 characters'),

    body('image')
        .optional()
        .trim()
        .isURL().withMessage('Image must be a valid URL')
];

const productIdValidator = [
    param('id')
        .isInt({ min: 1 }).withMessage('Product ID must be a positive integer')
];

const cartProductIdValidator = [
    param('productId')
        .isInt({ min: 1 }).withMessage('Product ID must be a positive integer')
];

module.exports = {
    registerValidator,
    verifyOtpValidator,
    loginValidator,
    createProductValidator,
    updateProductValidator,
    productIdValidator,
    cartProductIdValidator
};