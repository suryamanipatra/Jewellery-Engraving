from pydantic import BaseModel
from datetime import datetime
from .product import Product

class JewelryImageBase(BaseModel):
    jewelry_upload_id: int
    view_type: str
    image_height: int
    image_width: int
    file_path: str

class JewelryImageCreate(JewelryImageBase):
    pass

class JewelryImage(BaseModel):
    id: int
    jewelry_upload_id: int
    view_type: str
    image_height: int
    image_width: int
    file_path: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True