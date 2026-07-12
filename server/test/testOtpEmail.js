import dotenv from "dotenv";
import { sendEmail } from "../utils/sendEmail.js";

dotenv.config();

const testEmail = async () => {
  const recipient = process.env.SMTP_USER || "test@example.com";
  console.log("Starting SMTP Test...");
  console.log(`SMTP User: ${process.env.SMTP_USER}`);
  console.log(`SMTP Service: ${process.env.SMTP_SERVICE}`);
  console.log(`SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(`SMTP Port: ${process.env.SMTP_PORT}`);
  console.log(`SMTP Secure: ${process.env.SMTP_SECURE}`);
  console.log(`Recipient: ${recipient}`);

  try {
    const result = await sendEmail({
      to: recipient,
      subject: "Nodemailer SMTP Connection Test",
      html: `
        <h3>Job Portal SMTP Verification</h3>
        <p>Your Nodemailer configuration is working successfully!</p>
        <p>Test OTP: <strong>123456</strong></p>
      `
    });

    console.log("Result:", result);
    if (result.provider === 'mock') {
      console.log("\n⚠️ NOTE: Email was NOT sent via SMTP. It fell back to Mock console logging because SMTP_USER or SMTP_PASS is empty in your .env file.");
    } else {
      console.log("\n✅ SUCCESS: Email successfully sent via SMTP!");
    }
  } catch (error) {
    console.error("\n❌ ERROR: Failed to send email via SMTP:", error);
  }
};

testEmail();
