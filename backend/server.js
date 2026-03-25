require('dotenv').config();

const connectDb = require('./config/db');
const app = require('./app');
const logger = require('./utils/logger');
const redis = require('./config/redis');

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await connectDb();

        const server = app.listen(PORT, () => {
            logger.info(`Server running at http://localhost:${PORT}`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`Health check: http://localhost:${PORT}/api/health`);
        });

        process.on('SIGTERM', () => {
            logger.info('SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                logger.info('HTTP server closed');
                redis.disconnect();
                logger.info('Redis connection closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            logger.info('SIGINT received. Shutting down gracefully...');
            server.close(() => {
                logger.info('HTTP server closed');
                redis.disconnect();
                logger.info('Redis connection closed');
                process.exit(0);
            });
        });

        process.on('unhandledRejection', (reason, promise) => {
            logger.error(`Unhandled Rejection: ${reason}`);
            server.close(() => {
                process.exit(1);
            });
        });

        process.on('uncaughtException', (error) => {
            logger.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
            process.exit(1);
        });

    } catch (error) {
        logger.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
})();