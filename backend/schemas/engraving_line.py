from pydantic import BaseModel
from datetime import datetime
from typing import List

class EngravingLineBase(BaseModel):
    engraving_id: int
    line_number: int
    text: str
    font_type: str
    font_size: int
    font_color: str
    position_x: float
    position_y: float
    path_coordinates: List[dict]  

class EngravingLineCreate(EngravingLineBase):
    pass

class EngravingLineResponse(EngravingLineBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True