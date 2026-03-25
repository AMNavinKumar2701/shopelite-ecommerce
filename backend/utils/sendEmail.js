const nodemailer = require('nodemailer');
const logger = require('./logger');
const ApiError = require('./ApiError');

const sendEmail = async (email, otp) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        logger.error('Email credentials not configured in environment variables');
        throw ApiError.internal('Email service is not configured');
    }

    if (!email) {
        throw ApiError.badRequest('Recipient email address is required');
    }

    if (!otp) {
        throw ApiError.internal('OTP is required for email verification');
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: `ECOMMERCE API <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'OTP Verification — E-Commerce App',
            text: `Your OTP verification code is: ${otp}\n\nThis code expires in 10 minutes.\nDo not share this code with anyone.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Email Verification</h2>
                    <p style="color: #666;">Your OTP verification code is:</p>
                    <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
                        <h1 style="color: #333; letter-spacing: 5px; margin: 0;">${otp}</h1>
                    </div>
                    <p style="color: #999; font-size: 12px;">This code expires in 10 minutes. Do not share this code with anyone.</p>
                </div>
            `
        });

        logger.info(`Verification email sent to ${email} [MessageID: ${info.messageId}]`);

    } catch (error) {
        logger.error(`Failed to send email to ${email}: ${error.message}`);
        throw ApiError.internal('Failed to send verification email. Please try again later.');
    }
};

module.exports = sendEmail;