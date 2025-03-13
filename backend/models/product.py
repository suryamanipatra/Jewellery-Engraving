from sqlalchemy import Column, Integer, Enum, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from utils.database import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    jewelry_image_id = Column(Integer, ForeignKey("jewelry_images.id"), nullable=False)
    product_type = Column(Enum('ring', 'earring', 'necklace', name='product_type_enum'), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    image = relationship("JewelryImage", back_populates="product")