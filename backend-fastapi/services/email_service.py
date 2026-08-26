import smtplib
import asyncio
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from config import settings

logger = logging.getLogger("email_service")

def _send_sync_email(to_email: str, subject: str, html_content: str, text_content: str) -> bool:
    """Internal synchronous sender running in a worker thread."""
    if not settings.SMTP_PASSWORD or not settings.SMTP_USER:
        logger.warning("SMTP credentials not configured. Email will not be sent.")
        return False

    # Normalize Google App Password by removing any spaces
    clean_password = settings.SMTP_PASSWORD.replace(" ", "")
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
    msg["To"] = to_email

    msg.attach(MIMEText(text_content, "plain", "utf-8"))
    msg.attach(MIMEText(html_content, "html", "utf-8"))

    try:
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(settings.SMTP_USER, clean_password)
        server.sendmail(settings.SMTP_FROM_EMAIL, [to_email], msg.as_string())
        server.quit()
        logger.info(f"Email successfully sent to {to_email} with subject '{subject}'")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False

async def send_otp_email(to_email: str, recipient_name: str, otp_code: str) -> bool:
    """Send branded 6-digit OTP verification email."""
    subject = f"{otp_code} is your Zoodo verification code"
    
    text_content = f"""
Hello {recipient_name},

Welcome to Zoodo!

Your 6-digit account verification code is:
{otp_code}

This code will expire in 10 minutes. If you did not request this verification, please disregard this email.

Warm regards,
The Zoodo Care Team
zoodo.care@gmail.com
"""

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
  <style>
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      margin: 0;
      padding: 24px;
    }}
    .card {{
      max-width: 520px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      padding: 40px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }}
    .logo {{
      font-size: 26px;
      font-weight: 800;
      color: #0f766e;
      margin-bottom: 24px;
      letter-spacing: -0.5px;
    }}
    .greeting {{
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 12px;
      color: #0f172a;
    }}
    .desc {{
      font-size: 15px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 28px;
    }}
    .otp-box {{
      background: #f0fdfa;
      border: 2px dashed #0d9488;
      border-radius: 14px;
      padding: 20px;
      text-align: center;
      margin-bottom: 28px;
    }}
    .otp-code {{
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #0f766e;
      font-family: monospace;
      margin: 0;
    }}
    .expiry {{
      font-size: 13px;
      color: #64748b;
      margin-top: 8px;
      margin-bottom: 0;
    }}
    .footer {{
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #f1f5f9;
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
    }}
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🐾 Zoodo</div>
    <div class="greeting">Hi {recipient_name},</div>
    <p class="desc">
      Thank you for joining <strong>Zoodo</strong>. Please enter the 6-digit code below to verify your email address and activate your account.
    </p>
    <div class="otp-box">
      <div class="otp-code">{otp_code}</div>
      <p class="expiry">Expires in 10 minutes</p>
    </div>
    <p class="desc" style="font-size: 13px; color: #64748b;">
      If you did not initiate this request, you can safely ignore this message. Your account remains protected.
    </p>
    <div class="footer">
      Sent with care by Zoodo • Healthcare, Care & Community for Pets<br>
      Contact: <a href="mailto:zoodo.care@gmail.com" style="color: #0d9488;">zoodo.care@gmail.com</a>
    </div>
  </div>
</body>
</html>"""

    return await asyncio.to_thread(_send_sync_email, to_email, subject, html_content, text_content)

async def send_welcome_email(to_email: str, recipient_name: str, user_type: str = "pet_owner") -> bool:
    """Send welcome email upon successful verification."""
    is_biz = user_type == "business"
    subject = f"Welcome to Zoodo, {recipient_name}! 🐾"
    
    headline = "Welcome to Zoodo Business!" if is_biz else "Your Pet's Care Journey Starts Here!"
    message = (
        "Your business account is verified and ready. You can now complete your listing, upload verification certificates, and start connecting with thousands of pet owners."
        if is_biz else
        "Your account is verified! You can now manage your pets, book trusted veterinarians, explore grooming & training services, and consult Dr. Salus AI anytime."
    )

    text_content = f"Hi {recipient_name},\n\n{headline}\n\n{message}\n\nWarm regards,\nThe Zoodo Team"
    html_content = f"""<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #f8fafc; padding: 24px;">
  <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0;">
    <h2 style="color: #0f766e; margin-top: 0;">🐾 {headline}</h2>
    <p style="color: #334155; line-height: 1.6;">Hi <strong>{recipient_name}</strong>,</p>
    <p style="color: #334155; line-height: 1.6;">{message}</p>
    <div style="margin-top: 24px; padding: 16px; background: #f0fdfa; border-radius: 12px; color: #0f766e; font-size: 14px;">
      ✨ Tip: Bookmark your dashboard to manage appointments and updates easily.
    </div>
  </div>
</body>
</html>"""

    return await asyncio.to_thread(_send_sync_email, to_email, subject, html_content, text_content)
