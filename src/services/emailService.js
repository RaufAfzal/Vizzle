import nodemailer from "nodemailer";
import { ApiError } from "../utils/ApiError.js";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
})

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

/**
 * Send Email Function
 * @param {string} to - Recipient's email address
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML)
 */

const sendEmail = async (to, subject, html) => {
    const mailOptions = {
        from: `"Your App" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    }
    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error.message)
        throw new ApiError(500, "Something went wrong while creating the vedio")
    }
}

export {
    sendEmail
}