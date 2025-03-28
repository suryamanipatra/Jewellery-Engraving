from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.database import get_db
from models.user import User
from schemas.mail import ContactUsRequest
from typing import List

router = APIRouter(tags=["Contact Us"])

@router.get("/users", response_model=List[ContactUsRequest])
def get_users(db: Session = Depends(get_db)):
    try:
        users = db.query(User).filter(User.message != None).filter(User.role == 'user').all()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    

@router.delete("/delete-message")
def delete_message(mail: str, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == mail).first()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    try:
        user.message = None
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    return {"message": "Message deleted successfully"}
