from sqlalchemy import Column, Integer, ForeignKey, String, TIMESTAMP, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mysql import JSON
from utils.database import Base

class EngravingLine(Base):
    __tablename__ = "engraving_lines"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    engraving_id = Column(Integer, ForeignKey("engraving_details.id"), nullable=False)
    line_number = Column(Integer, nullable=False)
    text = Column(String(255), nullable=False)
    font_type = Column(String(100), nullable=False)
    font_size = Column(Integer, nullable=False)
    font_color = Column(String(10), nullable=False)
    position_x = Column(Float, nullable=False)
    position_y = Column(Float, nullable=False)
    # path_coordinates = Column(JSON, nullable=False)
    path_coordinates = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    engraving = relationship("EngravingDetail", back_populates="lines")