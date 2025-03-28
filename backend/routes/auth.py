from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from models.user import User
from utils.database import get_db
from utils.auth import get_password_hash, verify_password
from utils.jwttoken import create_access_token
from utils.auth_dependencies import verify_role
from schemas.auth import Token, UserBasicInfo, LoginResponse
from schemas.auth import UserCreate
from sqlalchemy.exc import SQLAlchemyError
import requests


router = APIRouter(tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/signup")
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = db.query(User).filter(User.email == user.email).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_password = get_password_hash(user.password)

        new_user = User(
            name=user.name,
            email=user.email,
            password_hash=hashed_password,
            role="user"
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {"message": "Registered successfully"}

    except SQLAlchemyError as e:
        db.rollback() 
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

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
    
    return response_data

@router.post("/admin/users")
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



@router.post("/google-login", response_model=LoginResponse)
async def google_login(google_data: dict, db: Session = Depends(get_db)):
    print(google_data)
    access_token = google_data.get("token")
    if not access_token:
        raise HTTPException(status_code=400, detail="Access token required")
    try:
        response = requests.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        response.raise_for_status()
        user_info = response.json()
        print(user_info)
    except requests.RequestException:
        raise HTTPException(status_code=400, detail="Invalid Google token")

    email = user_info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email not provided by Google")
    user = db.query(User).filter(User.email == email).first()
    if user:
        if user.provider != 'google':
            raise HTTPException(
                status_code=400,
                detail="Account exists with email/password. Use email login."
            )
    else:
        user = User(
            name=user_info.get("name", email.split('@')[0]),
            email=email,
            provider='google',
            password_hash=None,
            role='user'
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    access_token_jwt = create_access_token(data={"sub": str(user.id)})
    user_info = UserBasicInfo(name=user.name, email=user.email, role=user.role)
    response_data = {
        "access_token": access_token_jwt,
        "token_type": "bearer",
        "user": user_info
    }

    if user.role == "super_admin":
        admin_users = db.query(User).filter(User.role.in_(["super_admin", "admin"])).all()
        response_data["admin_list"] = [
            UserBasicInfo(name=admin.name, email=admin.email, role=admin.role)
            for admin in admin_users
        ]

    return response_data

