
from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class UserBasicInfo(BaseModel):
    # id: int
    name: str
    email: str
    role: str
    password:Optional[str] = None

    class Config:
        from_attributes = True

class LoginResponse(Token):
    user: UserBasicInfo
    # admin_list: Optional[List[UserBasicInfo]] = None


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str