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
  const senderName = process.env.SENDER_NAME || 'Wayhyre';
  const formattedSender = `"${senderName}" <${senderEmail}>`;
  const isGenericDomain = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"].some(d => senderEmail.toLowerCase().includes(d));

  // 1. Try Resend HTTP API if configured and not using a generic domain
  if (process.env.RESEND_API_KEY && !isGenericDomain) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: formattedSender,
          to,
          subject,
          html,
          text: text || html.replace(/<[^>]*>/g, '').trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`[Resend] Email successfully delivered to ${to}. Message ID: ${data.id}`);
        return { success: true, provider: 'resend', id: data.id };
      } else {
        const errText = await response.text();
        console.error("[Resend API Error]:", errText);
      }
    } catch (resendError) {
      console.error("[Resend] Sending failed, attempting SMTP fallback...", resendError);
    }
  }

  // 2. Try Nodemailer SMTP if configured
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || 'gmail',
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: process.env.SMTP_SECURE !== 'false',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        family: 4, // Force IPv4
      });

      const info = await transporter.sendMail({
        from: formattedSender,
        replyTo: senderEmail,
        to,
        subject,
        text: text || html.replace(/<[^>]*>/g, '').trim(),
        html,
        headers: {
          'X-Entity-Ref-ID': Date.now().toString(),
          'Precedence': 'bulk',
        }
      });

      console.log(`[SMTP] Email sent via SMTP to ${to}. Message ID: ${info.messageId}`);
      return { success: true, provider: 'smtp', messageId: info.messageId };
    } catch (smtpError) {
      console.error("[SMTP Error] Sending failed:", smtpError);
      throw smtpError;
    }
  }

  // 2. Fallback to Mock Mode (Console Logging) if SMTP is not configured
  const otpMatch = html.match(/<strong>(\d+)<\/strong>/);
  const otp = otpMatch ? otpMatch[1] : 'N/A';
  console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | OTP: ${otp}`);
  return { success: true, provider: 'mock', otp };
};
