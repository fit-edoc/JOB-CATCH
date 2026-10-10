import dotenv from "dotenv";
import { sendEmail } from "../utils/sendEmail.js";

dotenv.config();

const testEmail = async () => {
  const customRecipient = process.argv[2];
  const recipient = customRecipient || process.env.SMTP_USER || "test@example.com";
  console.log("\n============================================");
  console.log("🚀 Testing Email Dispatch Service");
  console.log("============================================");
  console.log(`Sender: ${process.env.SENDER_EMAIL || process.env.SMTP_USER}`);
  console.log(`Recipient: ${recipient}`);
  console.log(`Resend API Key present: ${Boolean(process.env.RESEND_API_KEY)}`);
  console.log(`SMTP User: ${process.env.SMTP_USER || '(None)'}`);
  console.log("--------------------------------------------");

  try {
    const testOtp = "789123";
    const result = await sendEmail({
      to: recipient,
      subject: `${testOtp} is your Wayhyre verification code`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Wayhyre Verification Code</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;500;600;700;800&display=swap');
  * {
    font-family: 'Bricolage Grotesque', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
</style>
</head>
<body style="margin:0;padding:48px 16px;background-color:#000000;font-family:'Bricolage Grotesque',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #1a1a1a;">
  <tr>
    <td style="background-color:#000000;padding:26px 32px;border-bottom:1px solid #222222;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="left" style="vertical-align:middle;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background-color:#ffffff;width:28px;height:28px;text-align:center;vertical-align:middle;color:#000000;font-size:16px;font-weight:900;font-family:'Bricolage Grotesque',sans-serif;line-height:28px;">
                  W
                </td>
                <td style="padding-left:12px;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.03em;font-family:'Bricolage Grotesque',sans-serif;">
                  Wayhyre
                </td>
              </tr>
            </table>
          </td>
          <td align="right" style="vertical-align:middle;">
            <span style="display:inline-block;padding:4px 10px;background-color:#000000;border:1px solid #ffffff;color:#ffffff;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:'Bricolage Grotesque',sans-serif;">
              SECURITY
            </span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:40px 32px 32px;background-color:#ffffff;">
      <h1 style="margin:0 0 12px;color:#000000;font-size:24px;font-weight:800;letter-spacing:-0.03em;font-family:'Bricolage Grotesque',sans-serif;">
        Hi Candidate,
      </h1>
      <p style="margin:0 0 28px;color:#333333;font-size:14px;line-height:1.6;font-family:'Bricolage Grotesque',sans-serif;">
        Use your 6-digit one-time code below to verify and sign in to your Wayhyre account.
      </p>

      <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:28px auto 32px;">
        <tr>
          ${testOtp.split('').map(digit => `
            <td style="padding:0 5px;">
              <div style="width:46px;height:54px;line-height:54px;text-align:center;font-size:28px;font-weight:800;font-family:'Bricolage Grotesque',ui-monospace,monospace;background-color:#ffffff;color:#000000;border:2px solid #000000;">
                ${digit}
              </div>
            </td>
          `).join('')}
        </tr>
      </table>

      <div style="background-color:#ffffff;border:1px solid #000000;padding:14px 16px;margin:28px 0 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="color:#000000;font-size:12.5px;line-height:1.5;font-family:'Bricolage Grotesque',sans-serif;">
              <strong>Expires in 10 minutes:</strong> Never share this verification code with anyone. Wayhyre representatives will never ask for your code.
            </td>
          </tr>
        </table>
      </div>

      <p style="margin:16px 0 0;color:#666666;font-size:12px;line-height:1.5;text-align:center;font-family:'Bricolage Grotesque',sans-serif;">
        If you didn't request this verification code, you can safely ignore this email.
      </p>
    </td>
  </tr>

  <tr>
    <td style="background-color:#000000;padding:24px 32px;text-align:center;border-top:1px solid #000000;">
      <p style="margin:0 0 6px;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:0.5px;font-family:'Bricolage Grotesque',sans-serif;">
        WAYHYRE · TALENT & HIRING PLATFORM
      </p>
      <p style="margin:0;color:#888888;font-size:11px;font-family:'Bricolage Grotesque',sans-serif;">
        © ${new Date().getFullYear()} Wayhyre Inc. All rights reserved.
      </p>
    </td>
  </tr>
</table>
</body>
</html>
      `,
      text: `Wayhyre Verification Code: ${testOtp}. Expires in 10 minutes. Never share this code with anyone.`
    });

    console.log("\n✅ Result:", result);
    if (result.provider === 'resend') {
      console.log(`🎉 SUCCESS! Sent via Resend API using custom domain! ID: ${result.id}`);
    } else if (result.provider === 'smtp') {
      console.log(`✉️ SUCCESS! Sent via SMTP! MessageId: ${result.messageId}`);
    } else {
      console.log(`⚠️ Mock Fallback: Logged to console only.`);
    }
  } catch (error) {
    console.error("\n❌ ERROR: Failed to send email:", error);
  }
};

testEmail();
