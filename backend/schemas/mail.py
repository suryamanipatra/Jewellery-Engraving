from pydantic import BaseModel


class EmailRequest(BaseModel):
    email: str


class VerifyOtp(BaseModel):
    email: str
    otp: str
    password: str