from pydantic import BaseModel
from datetime import datetime

class JewelryUploadBase(BaseModel):
    user_id: int
    jewelry_name: str
    upload_source: str

class JewelryUploadCreate(JewelryUploadBase):
    pass

class JewelryUpload(JewelryUploadBase):
    id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True