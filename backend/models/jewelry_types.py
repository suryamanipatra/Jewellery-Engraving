from utils.database import Base

from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func

class JewelryTypes(Base):
    __tablename__ = "jewelry_types"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
