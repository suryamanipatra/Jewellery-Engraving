from pydantic import BaseModel
from datetime import datetime

class ProductBase(BaseModel):
    jewelry_image_id: int
    product_type: str

class ProductCreate(ProductBase):
    jewelry_upload_id: int  

class Product(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True