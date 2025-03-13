from sqlalchemy import Column, Integer, String, Enum, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from utils.database import Base

class JewelryImage(Base):
    __tablename__ = "jewelry_images"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    jewelry_upload_id = Column(Integer, ForeignKey("jewelry_uploads.id"), nullable=False)
    view_type = Column(Enum("front", "side", "angled", "top"), nullable=False)
    image_height = Column(Integer, nullable=False)
    image_width = Column(Integer, nullable=False)
    file_path = Column(String(255), nullable=False)
    uploaded_at = Column(TIMESTAMP, server_default=func.now())
    
    upload = relationship("JewelryUpload", back_populates="images")
    product = relationship("Product", back_populates="image", uselist=False)
    engraving_details = relationship("EngravingDetail", back_populates="image")