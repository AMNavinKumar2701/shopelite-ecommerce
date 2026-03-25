const cron = require('node-cron');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const hpp = require('hpp');
const compression = require('compression');
const errorHandler = require('./middleware/errorMiddleware');
const deleteUnverifiedUsers = require('./utils/deleteUnverifiedUsers');
const { generalLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');
const ApiError = require('./utils/ApiError');

const app = express();

app.use(helmet());
app.use(hpp());
app.use(generalLimiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(compression());

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const morganStream = {
    write: (message) => {
        logger.info(message.trim());
    }
};

app.use(morgan(
    process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
    { stream: morganStream }
));

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'E-Commerce API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

app.use((req, res, next) => {
    next(ApiError.notFound(
        `Route ${req.method} ${req.originalUrl} not found on this server.`,
        'ROUTE_NOT_FOUND'
    ));
});

app.use(errorHandler);

cron.schedule('0 0 1 * *', async () => {
    logger.info('Running scheduled task: Delete unverified users');
    await deleteUnverifiedUsers();
});

module.exports = app;