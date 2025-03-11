from sqlalchemy.orm import Session
from models.jewelry_upload import JewelryUpload
from models.jewelry_image import JewelryImage

def create_jewelry_upload(db: Session, upload_data: dict):
    db_upload = JewelryUpload(**upload_data)
    db.add(db_upload)
    db.commit()
    db.refresh(db_upload)
    return db_upload

def create_jewelry_image(db: Session, image_data: dict):
    db_image = JewelryImage(**image_data)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image