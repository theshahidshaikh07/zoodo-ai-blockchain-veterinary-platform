import smtplib
import asyncio
import logging
import json
import os
import urllib.request
import urllib.error
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from config import settings

logger = logging.getLogger("email_service")

def _send_http_brevo(api_key: str, to_email: str, subject: str, html_content: str, text_content: str) -> bool:
    """Send transactional email via Brevo HTTPS REST API (Port 443 - never blocked on cloud)."""
    try:
        url = "https://api.brevo.com/v3/smtp/email"
        sender_email = (settings.SMTP_FROM_EMAIL or settings.SMTP_USER or os.getenv("SMTP_USER") or "zoodo.care@gmail.com").strip()
        sender_name = (settings.SMTP_FROM_NAME or "Zoodo Care").strip()
        payload = {
            "sender": {"name": sender_name, "email": sender_email},
            "to": [{"email": to_email}],
            "subject": subject,
            "htmlContent": html_content,
            "textContent": text_content,
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "api-key": api_key.strip(),
                "Content-Type": "application/json",
                "Accept": "application/json",
                "User-Agent": "Zoodo-Backend/2.0"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status in (200, 201, 202):
                logger.info(f"[+] Brevo HTTP Email sent successfully to {to_email}!")
                print(f"[+] Email successfully delivered to {to_email} via Brevo HTTP API (Port 443)!")
                return True
    except urllib.error.HTTPError as e_http:
        err_body = e_http.read().decode("utf-8", errors="ignore")
        logger.error(f"[!] Brevo HTTP Error {e_http.code}: {err_body}")
        print(f"[!] Brevo HTTP Error {e_http.code}: {err_body}")
    except Exception as e:
        logger.error(f"[!] Brevo HTTP Email failed: {e}")
        print(f"[!] Brevo HTTP Email failed: {e}")
    return False

def _send_http_resend(api_key: str, to_email: str, subject: str, html_content: str, text_content: str) -> bool:
    """Send transactional email via Resend HTTPS REST API (Port 443 - never blocked on cloud)."""
    try:
        url = "https://api.resend.com/emails"
        from_email = "onboarding@resend.dev"
        if settings.SMTP_FROM_EMAIL and not settings.SMTP_FROM_EMAIL.endswith("@gmail.com"):
            from_email = settings.SMTP_FROM_EMAIL
        payload = {
            "from": f"{settings.SMTP_FROM_NAME or 'Zoodo Care'} <{from_email}>",
            "to": [to_email],
            "subject": subject,
            "html": html_content,
            "text": text_content,
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Authorization": f"Bearer {api_key.strip()}",
                "Content-Type": "application/json",
                "User-Agent": "Zoodo-Backend/2.0"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status in (200, 201, 202):
                logger.info(f"[+] Resend HTTP Email sent successfully to {to_email}!")
                print(f"[+] Email successfully delivered to {to_email} via Resend HTTP API (Port 443)!")
                return True
    except urllib.error.HTTPError as e_http:
        err_body = e_http.read().decode("utf-8", errors="ignore")
        logger.error(f"[!] Resend HTTP Error {e_http.code}: {err_body}")
        print(f"[!] Resend HTTP Error {e_http.code}: {err_body}")
    except Exception as e:
        logger.error(f"[!] Resend HTTP Email failed: {e}")
        print(f"[!] Resend HTTP Email failed: {e}")
    return False

def _send_sync_email(to_email: str, subject: str, html_content: str, text_content: str) -> bool:
    """Internal email dispatcher with Resend HTTP API (Port 443) priority and direct SMTP fallback."""
    # 1. Brevo HTTP API (Port 443 - Can send to ANY email address worldwide without domain verification)
    brevo_key = (getattr(settings, "BREVO_API_KEY", "") or os.getenv("BREVO_API_KEY") or "").strip()
    if brevo_key:
        print(f"[*] Attempting email delivery to {to_email} via Brevo HTTP API (Port 443)...")
        if _send_http_brevo(brevo_key, to_email, subject, html_content, text_content):
            return True

    # 2. Resend HTTP API (Port 443 - Zero IP restrictions)
    resend_key = (getattr(settings, "RESEND_API_KEY", "") or os.getenv("RESEND_API_KEY") or "").strip()
    if resend_key:
        print(f"[*] Attempting email delivery to {to_email} via Resend HTTP API (Port 443)...")
        if _send_http_resend(resend_key, to_email, subject, html_content, text_content):
            return True

    # 2. Fallback to direct SMTP (Works on localhost or paid cloud instances)
    user = (settings.SMTP_USER or os.getenv("SMTP_USER") or "").strip()
    raw_pwd = (settings.SMTP_PASSWORD or os.getenv("SMTP_PASSWORD") or "").strip()
    
    if not user or not raw_pwd:
        logger.warning("SMTP credentials not configured (SMTP_USER or SMTP_PASSWORD missing). Email will not be sent.")
        print(f"[!] SMTP Warning: SMTP_USER='{user}', SMTP_PASSWORD set={bool(raw_pwd)}. Email skipped.")
        return False

    clean_password = raw_pwd.strip("'\"").replace(" ", "")
    from_email = user if "@" in user else (settings.SMTP_FROM_EMAIL or user)
    from_name = settings.SMTP_FROM_NAME or "Zoodo Care"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{from_name} <{from_email}>"
    msg["To"] = to_email

    msg.attach(MIMEText(text_content, "plain", "utf-8"))
    msg.attach(MIMEText(html_content, "html", "utf-8"))

    # Attempt 1: Port 465 with direct SMTP_SSL
    try:
        print(f"[*] Attempting email delivery to {to_email} via {settings.SMTP_HOST}:465 (SSL)...")
        ssl_server = smtplib.SMTP_SSL(settings.SMTP_HOST, 465, timeout=10)
        ssl_server.ehlo()
        ssl_server.login(user, clean_password)
        ssl_server.sendmail(from_email, [to_email], msg.as_string())
        ssl_server.quit()
        logger.info(f"Email successfully sent to {to_email} via SSL port 465!")
        print(f"[+] Email successfully delivered to {to_email} via SSL port 465!")
        return True
    except Exception as e_ssl:
        print(f"[!] Port 465 (SSL) failed: {e_ssl}. Attempting fallback via port 587 (STARTTLS)...")
        
        # Attempt 2: Port 587 with STARTTLS fallback
        try:
            server = smtplib.SMTP(settings.SMTP_HOST, 587, timeout=10)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(user, clean_password)
            server.sendmail(from_email, [to_email], msg.as_string())
            server.quit()
            logger.info(f"Email successfully sent to {to_email} with subject '{subject}' via port 587")
            print(f"[+] Email successfully delivered to {to_email} via port 587!")
            return True
        except Exception as e_starttls:
            logger.error(f"Failed to send email to {to_email}: SSL error: {e_ssl} | STARTTLS error: {e_starttls}")
            print(f"[!] Email delivery completely failed for {to_email}: {e_starttls}")
            return False

def test_smtp_diagnostic(to_email: str) -> dict:
    """Diagnose SMTP settings and test dispatching an email."""
    user = (settings.SMTP_USER or os.getenv("SMTP_USER") or "").strip()
    raw_pwd = (settings.SMTP_PASSWORD or os.getenv("SMTP_PASSWORD") or "").strip()
    clean_pwd = raw_pwd.strip("'\"").replace(" ", "")

    brevo_key = (getattr(settings, "BREVO_API_KEY", "") or os.getenv("BREVO_API_KEY") or "").strip()
    resend_key = (getattr(settings, "RESEND_API_KEY", "") or os.getenv("RESEND_API_KEY") or "").strip()

    diag = {
        "smtp_host": settings.SMTP_HOST,
        "smtp_port": settings.SMTP_PORT,
        "smtp_user": user if user else "NOT_CONFIGURED",
        "has_password": bool(raw_pwd),
        "password_length": len(clean_pwd),
        "brevo_api_configured": bool(brevo_key),
        "resend_api_configured": bool(resend_key),
        "recipient": to_email,
        "results": {}
    }

    if not user and not raw_pwd and not brevo_key and not resend_key:
        diag["error"] = "No email credentials configured. Set BREVO_API_KEY or SMTP_USER/SMTP_PASSWORD."
        return diag

    # Test Port 587
    try:
        s = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10)
        s.ehlo()
        s.starttls()
        s.ehlo()
        s.login(user, clean_pwd)
        s.quit()
        diag["results"]["port_587_starttls"] = "SUCCESS - Credentials Authenticated"
    except Exception as e:
        diag["results"]["port_587_starttls"] = f"FAILED: {str(e)}"

    # Test Port 465
    try:
        s_ssl = smtplib.SMTP_SSL(settings.SMTP_HOST, 465, timeout=10)
        s_ssl.ehlo()
        s_ssl.login(user, clean_pwd)
        s_ssl.quit()
        diag["results"]["port_465_ssl"] = "SUCCESS - Credentials Authenticated"
    except Exception as e:
        diag["results"]["port_465_ssl"] = f"FAILED: {str(e)}"

    # Attempt sending a live test message
    sent = _send_sync_email(
        to_email,
        "Zoodo SMTP Connection Test",
        "<p>This is a test verification message confirming that Gmail SMTP is operating correctly on your Render backend.</p>",
        "This is a test verification message confirming that Gmail SMTP is operating correctly."
    )
    diag["email_dispatched"] = sent
    diag["provider_used"] = "Resend (Port 443 HTTPS)" if resend_key else "SMTP"
    return diag

def send_otp_email(to_email: str, recipient_name: str, otp_code: str) -> bool:
    """Send branded 6-digit OTP verification email synchronously in background worker."""
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

    return _send_sync_email(to_email, subject, html_content, text_content)

def send_welcome_email(to_email: str, recipient_name: str, user_type: str = "pet_owner") -> bool:
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

    return _send_sync_email(to_email, subject, html_content, text_content)
