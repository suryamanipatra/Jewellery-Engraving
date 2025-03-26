from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP
from sqlalchemy.sql import func
from utils.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    provider = Column(String(50), default='email')
    role = Column(Enum('super_admin','admin', 'user', name='user_roles'), nullable=False, default='user')
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    
    jewelry_uploads = relationship("JewelryUpload", back_populates="user")