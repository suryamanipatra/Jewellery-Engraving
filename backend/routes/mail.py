from fastapi import HTTPException, Depends, APIRouter, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import random
import string
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from typing import Optional
from cachetools import TTLCache
from schemas.mail import EmailRequest, VerifyOtp, ContactUsRequest, AdminEmailRequest
from models.user import User
from utils.auth import get_password_hash
from utils.database import get_db
import os
from dotenv import load_dotenv



load_dotenv()

router = APIRouter(tags=["Mail"])

EMAIL_FROM = os.getenv("EMAIL_FROM")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_SUBTYPE = os.getenv("EMAIL_SUBTYPE")
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT"))

otp_cache = TTLCache(maxsize=100, ttl=300)


def otp_body(otp: str):
    return f"""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0; padding:0;">
            <div style="width:100%; display:flex; justify-content:center; align-items:center; text-align:center;">
                <div style="font-family: Arial, sans-serif; max-width:600px; width:100%; margin:0 auto; text-align:center;">
                    <h2 style="color:#062538;">Welcome to Kama Engraving!</h2>
                    <p>Thank you for signing up! Your One-Time Password (OTP) is:</p>
                    <p style="font-size: 24px; font-weight: bold; margin: 20px 0; color:#062538;">{otp}</p>
                    <p>Please enter this OTP in the app to verify your email address.</p>
                    <p>This OTP will be valid for <span style="color:#062538;">5 mins.</span></p>
                    <p>If you didn't request this, you can ignore this email.</p>
                </div>
            </div>
        </body>
    </html>
    """

def welcome_admin_body(username: str, email: str, password: str):
    return f"""
    <html>
    <body style="font-family: Arial, sans-serif;">
        <h2 style="color:#062538;">Welcome to Kama Engraving, {username}!</h2>
        <p>We are pleased to have you onboard as an administrator.</p>
        <p>Your admin login credentials:</p>
        <ul>
            <li><strong>Email:</strong> {email}</li>
            <li><strong>Password:</strong> {password}</li>
        </ul>
        <p>Please change your password after logging in for security reasons using Forgot Password option.</p>
        <p>Best Regards,<br> Kama Engraving Team</p>
    </body>
    </html>
    """

def contact_us_body(username: str):
    return f"""
    <html>
    <body style="font-family: Arial, sans-serif;">
        <h2 style="color:#062538;">Thank You for Reaching Out, {username}!</h2>
        <p>We have received your query and our team will get back to you shortly.</p>
        <p>Meanwhile, feel free to browse our <a href="https://kamaengraving.com">website</a>.</p>
        <p>Best Regards,<br> Kama Engraving Support Team</p>
    </body>
    </html>
    """

def send_email(to_email: str, subject: str, body: str, attachment: Optional[UploadFile] = None):
    message = MIMEMultipart()
    message["From"] = EMAIL_FROM
    message["To"] = to_email
    message["Subject"] = subject
    
    message.attach(MIMEText(body, EMAIL_SUBTYPE))

    if attachment:
        try:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(attachment.file.read())
            encoders.encode_base64(part)
            part.add_header("Content-Disposition", f"attachment; filename={attachment.filename}")
            message.attach(part)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to attach file: {str(e)}")

    try:
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_FROM, EMAIL_PASSWORD)
            server.sendmail(EMAIL_FROM, to_email, message.as_string())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")


def generate_otp():
    """Generate a 6-digit OTP"""
    return "".join(random.choices(string.digits, k=6))


@router.post("/send-otp")
def send_otp(request: EmailRequest):
    otp = generate_otp()
    otp_cache[request.email] = otp  
    send_email(request.email, "Your OTP Code", otp_body(otp))
    return {"message": "OTP sent successfully!"}

@router.post("/welcome-to-admin")
def send_welcome_email(request: AdminEmailRequest):
    send_email(request.email, "Welcome to Kama Engraving (Admin)", welcome_admin_body(request.username, request.email, request.password))
    return {"message": "Welcome email sent successfully!"}

@router.post("/send-pdf")
def send_pdf(email: str, file: UploadFile = File(...)):
    send_email(email, "Your Requested Document", "Please find the attached document.", file)
    return {"message": "PDF sent successfully!"}

@router.post("/contact-us")
def contact_us(request: ContactUsRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    try:
        user.message = request.message
        user.phone = request.phone
        db.commit()

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    send_email(request.email, "Thank You for Contacting Us!", contact_us_body(request.name))

    return {"message": "Contact confirmation email sent successfully!"}

@router.post("/verify-otp")
def verify_otp(verify_otp : VerifyOtp, db: Session = Depends(get_db)):
    stored_otp = otp_cache.get(verify_otp.email)
    if not stored_otp:
        raise HTTPException(status_code=400, detail="OTP expired or invalid.")

    if stored_otp != verify_otp.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP.")
    
    try:
        del otp_cache[verify_otp.email]  
        hashed_password = get_password_hash(verify_otp.password)
        user = db.query(User).filter(User.email == verify_otp.email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")

        user.password_hash = hashed_password
        db.commit()

        return {"message": "OTP verified, Password updated successfully!"}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    

