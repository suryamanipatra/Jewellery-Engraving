from pydantic import BaseModel


class EmailRequest(BaseModel):
    email: str


class AdminEmailRequest(BaseModel):
    username: str
    email: str
    password: str

class ContactUsRequest(BaseModel):
    username: str
    email: str
    phone: str
    message: str
    

class VerifyOtp(BaseModel):
    email: str
    otp: str
    password: str