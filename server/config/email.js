
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
    if (process.env.RESEND_API_KEY) {
        const from = process.env.EMAIL_FROM;

        if (!from) {
            throw new Error('EMAIL_FROM is required when using Resend');
        }

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from,
                to: [to],
                subject,
                html,
                text
            })
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || `Resend API request failed with status ${response.status}`
            );
        }

        return result;
    }

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
