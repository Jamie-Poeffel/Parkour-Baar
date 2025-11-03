import { config } from '@dotenvx/dotenvx'
import nodemailer from 'nodemailer'
config()

export class Message {
    static Send = async (req, res) => {
        const { name, email, message } = req.body;

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASS
            }
        });

        const msg = {
            from: `"Parkourbaar.ch" <${process.env.GMAIL_USER}>`,
            to: 'jamie.poeffel@gmail.com',
            subject: name + " hat eine Nachricht via Parkourbaar.ch gesendet (" + email + ")",
            text: message,
        };

        try {
            const info = await transporter.sendMail(msg);
            console.log('Message sent:', info.messageId);
        } catch (err) {
            console.error('Error sending mail:', err);
        }


        res.json({ "message": "success" })
    }
}