from sqlalchemy import Column, Integer, String, Enum, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from utils.database import Base

class JewelryUpload(Base):
    __tablename__ = "jewelry_uploads"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    # user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_id = Column(Integer, nullable=False)
    jewelry_name = Column(String(255), nullable=False)
    upload_source = Column(Enum("local", "google_drive"), nullable=False)
    uploaded_at = Column(TIMESTAMP, server_default=func.now())
    
    images = relationship("JewelryImage", back_populates="upload")