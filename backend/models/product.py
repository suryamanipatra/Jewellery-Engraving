from sqlalchemy import Column, String, Integer, Enum, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from utils.database import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    jewelry_image_id = Column(Integer, ForeignKey("jewelry_images.id"), nullable=False)
    product_type = Column(String(50), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    image = relationship("JewelryImage", back_populates="product")