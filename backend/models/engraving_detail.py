from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from utils.database import Base

class EngravingDetail(Base):
    __tablename__ = "engraving_details"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    jewelry_image_id = Column(Integer, ForeignKey("jewelry_images.id"), nullable=False)
    total_lines = Column(Integer, nullable=False, default=1)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    image = relationship("JewelryImage", back_populates="engraving_details")
    lines = relationship("EngravingLine", back_populates="engraving", cascade="all, delete-orphan")