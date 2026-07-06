import nodemailer from "nodemailer";
import { config } from "../config/env";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_PASS
    }
})

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
    await transporter.sendMail({
        from: `"HR System" <${config.GMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html
    })
}

export default sendEmail;