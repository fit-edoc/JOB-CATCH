import nodemailer from 'nodemailer';

/**
 * Send an email using SMTP (Nodemailer) or a mock console log fallback.
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email body in HTML format
 * @param {string} [options.text] - Email body in plain text format (optional)
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_USER || 'no-reply@example.com';

  // 1. Try Resend HTTP API if configured (Highly recommended for cloud hosts to bypass port blocks)
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: senderEmail,
          to,
          subject,
          html,
          text: text || html.replace(/<[^>]*>/g, '')
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Email sent via Resend API to ${to}. ID: ${data.id}`);
        return { success: true, provider: 'resend', id: data.id };
      } else {
        const errText = await response.text();
        console.error("Resend API failed, response:", errText);
      }
    } catch (resendError) {
      console.error("Resend sending failed, trying SMTP fallback...", resendError);
    }
  }

  // 2. Try Nodemailer SMTP if configured
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || 'gmail',
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        family: 4, // Force IPv4 to prevent ENETUNREACH errors on cloud hosts that do not support IPv6 outbound
      });

      const info = await transporter.sendMail({
        from: senderEmail,
        to,
        subject,
        text: text || html.replace(/<[^>]*>/g, ''),
        html,
      });

      console.log(`Email sent via SMTP to ${to}. Message ID: ${info.messageId}`);
      return { success: true, provider: 'smtp', messageId: info.messageId };
    } catch (smtpError) {
      console.error("SMTP sending failed, error:", smtpError);
      throw smtpError;
    }
  }

  // 2. Fallback to Mock Mode (Console Logging) if SMTP is not configured
  const otpMatch = html.match(/<strong>(\d+)<\/strong>/);
  const otp = otpMatch ? otpMatch[1] : 'N/A';
  console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | OTP: ${otp}`);
  return { success: true, provider: 'mock', otp };
};
