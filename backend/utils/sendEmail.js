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
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 40px auto; padding: 0; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 30px 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">E-Commerce API</h2>
        </div>
        <div style="padding: 30px 20px;">
          <h3 style="color: #333333; margin-top: 0; font-size: 20px;">Verify Your Email</h3>
          <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
            Hello there,<br><br>You're almost ready to get started. Please use the following One-Time Password (OTP) to complete your verification process:
          </p>
          <div style="background: linear-gradient(to right, #f8fafc, #f1f5f9); border-left: 4px solid #8b5cf6; padding: 20px; text-align: center; border-radius: 8px; margin: 0 auto 25px auto;">
            <span style="display: block; font-size: 32px; font-weight: bold; color: #4338ca; letter-spacing: 8px; text-shadow: 1px 1px 2px rgba(0,0,0,0.05);">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 0;"><strong>Note:</strong> This code will expire in <strong>10 minutes</strong>.</p>
          <p style="color: #ef4444; font-size: 13px; margin-top: 8px;">Never share this code with anyone, including our support team.</p>
        </div>
        <div style="background-color: #f8fafc; padding: 15px 20px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} E-Commerce App. All rights reserved.</p>
        </div>
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
