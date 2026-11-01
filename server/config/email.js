
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
    const requiredEnv = [
        'EMAIL_HOST',
        'EMAIL_PORT',
        'EMAIL_USER',
        'EMAIL_PASS'
    ];

    const missing = requiredEnv.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(
            `Email configuration is missing: ${missing.join(', ')}`
        );
    }

    const port = Number(process.env.EMAIL_PORT);

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port,
        secure: port === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    return transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        text,
        html
    });
};

module.exports = sendEmail;
