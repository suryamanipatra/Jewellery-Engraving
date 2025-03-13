from pydantic import BaseModel
from datetime import datetime

class EngravingDetailCreate(BaseModel):
    jewelry_image_id: int
    total_lines: int = 1
class EngravingDetailResponse(BaseModel):
    id: int
    jewelry_image_id: int
    total_lines: int
    created_at: datetime

    class Config:
        from_attributes = True