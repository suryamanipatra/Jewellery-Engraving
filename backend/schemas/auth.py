
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class UserBasicInfo(BaseModel):
    # id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True

class LoginResponse(Token):
    user: UserBasicInfo
    # admin_list: Optional[List[UserBasicInfo]] = None