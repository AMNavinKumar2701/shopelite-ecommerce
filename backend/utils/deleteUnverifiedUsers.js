const User = require('../models/User');
const logger = require('./logger');

const deleteUnverifiedUsers = async () => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const result = await User.deleteMany({
            isVerified: false,
            createdAt: { $lt: oneMonthAgo }
        });

        logger.info(`Scheduled cleanup: Deleted ${result.deletedCount} unverified users`);

    } catch (error) {
        logger.error(`Scheduled cleanup failed: ${error.message}`);
    }
};

module.exports = deleteUnverifiedUsers;