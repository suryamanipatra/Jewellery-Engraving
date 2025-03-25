import random
import string
from fastapi import HTTPException, APIRouter
from cachetools import TTLCache

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
    return "".join(random.choices(string.digits, k=6))



@router.post("/send-otp")
def send_otp( email: str):
    pass
