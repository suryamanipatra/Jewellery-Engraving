from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from models.user import User
from utils.database import get_db
from utils.dependencies import get_current_user
from utils.auth import get_password_hash, verify_password
from utils.jwttoken import create_access_token
from utils.auth_dependencies import oauth2_scheme, verify_role
from schemas.auth import Token, UserBasicInfo, LoginResponse
from pydantic import BaseModel

router = APIRouter(tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
class Message(BaseModel):
    message: str


@router.post("/login", response_model=LoginResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=30)
    )
    user_info = UserBasicInfo(name=user.name, email=user.email, role=user.role)
    
    response_data = {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_info
    }
    
    if user.role == "super_admin":
        admin_users = db.query(User).filter(
            User.role.in_(["super_admin", "admin"])
        ).all()
        response_data["admin_list"] = [
            UserBasicInfo(name=admin.name, email=admin.email, role="super_admin") 
            for admin in admin_users
        ]
    
    return response_data
@router.post("/admin/users", response_model=Message)
async def create_admin_user(
    
    user_data: UserBasicInfo, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_role(["super_admin"]))
):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        role="admin"
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    
    return {"message": "Admin created successfully"}





























# @router.post("/admin/users", response_model=Token)
# async def create_admin_user(
#     user: UserCreate, 
#     db: Session = Depends(get_db),
#     admin: User = Depends(get_current_admin)
# ):
#     existing_user = db.query(User).filter(User.email == user.email).first()
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     new_user = User(
#         name=user.name,
#         email=user.email,
#         password_hash=get_password_hash(user.password),
#         # role=user.role
#     )
    
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)

#     return {
#         "access_token": create_access_token(
#             data={"sub": str(new_user.id), "role": new_user.role}
#         ),
#         "token_type": "bearer"
#     }


# @router.post("/signup", response_model=Token)
# async def signup(user: UserCreate, db: Session = Depends(get_db)):
#     db_user = db.query(User).filter(User.email == user.email).first()
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     hashed_password = get_password_hash(user.password)
#     new_user = User(
#         name=user.name,
#         email=user.email,
#         password_hash=hashed_password,
#         role="admin"
#     )
    
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)

#     access_token = create_access_token(
#         data={"sub": str(new_user.id), "role": new_user.role},
#         expires_delta=timedelta(minutes=30)
#     )
    
#     return {"access_token": access_token, "token_type": "bearer"}

# @router.post("/login", response_model=Token)
# async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.email == form_data.username).first()
    
#     if not user or not verify_password(form_data.password, user.password_hash):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect credentials",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
    
#     access_token = create_access_token(
#         data={"sub": str(user.id), "role": user.role},
#         expires_delta=timedelta(minutes=30)
#     )
    
#     return {"access_token": access_token, "token_type": "bearer"}


# def get_current_admin(current_user: User = Depends(get_current_user)):
#     if current_user.role != 'admin':
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Admin privileges required"
#         )
#     return current_user
