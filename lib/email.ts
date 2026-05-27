// lib/email.ts
import nodemailer from 'nodemailer';

// Create transporter using Google SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.SMTP_USER,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: `"Coprofiles" <${from}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error };
  }
}

export async function sendBulkEmails({
  to,
  subject,
  html,
}: {
  to: string[];
  subject: string;
  html: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: `"Coprofiles" <${process.env.SMTP_USER}>`,
      to: to.join(', '),
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Bulk email error:", error);
    return { success: false, error };
  }
}