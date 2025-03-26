from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import random
import string
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from fastapi import HTTPException, APIRouter
from cachetools import TTLCache
from schemas.mail import EmailRequest, VerifyOtp
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

def generate_otp():
    """Generate a 6-digit OTP"""
    return "".join(random.choices(string.digits, k=6))

def send_email(to_email: str, otp: str):
    """Function to send OTP via email."""
    subject = "Your OTP Code"
    message = MIMEMultipart()
    message["From"] = EMAIL_FROM
    message["To"] = to_email
    message["Subject"] = subject
    
    body = f"""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0; padding:0;">
            <div style="width:100%; display:flex; justify-content:center; align-items:center; text-align:center;">
                <div style="font-family: Arial, sans-serif; max-width:600px; width:100%; margin:0 auto; text-align:center;">
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: 062538;">Welcome to Kama Engraving !</h2>
                        <div style="padding: 0px; border-radius: 5px;">
                            <p>Thank you for signing up with Kama Engraving ! <br/>Your One-Time Password (OTP) is:</p>
                            <p style="font-size: 24px; font-weight: bold; margin: 20px 0; color: 062538;">{otp}</p>
                            <p>Please enter this OTP in the app to verify your email address.</p>
                            <p>If you didn't request this, you can ignore this email.</p>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    </html>
    """
    
    message.attach(MIMEText(body, EMAIL_SUBTYPE))
    try:
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_FROM, EMAIL_PASSWORD)
            server.sendmail(EMAIL_FROM, to_email, message.as_string())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

@router.post("/send-otp")
def send_otp(request: EmailRequest):
    otp = generate_otp()
    otp_cache[request.email] = otp  
    send_email(request.email, otp) 
    return {"message": "OTP sent successfully!"}

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