from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models.product import Product
from models.jewelry_image import JewelryImage
from models.jewelry_upload import JewelryUpload
from utils.database import get_db

router = APIRouter(prefix="/products", tags=["products"])

class ProductCreate(BaseModel):
    jewelry_upload_id: int
    product_type: str

@router.post("/")
def set_product_type(
    product_data: ProductCreate, 
    db: Session = Depends(get_db)
):
    
    upload = db.query(JewelryUpload).filter(
        JewelryUpload.id == product_data.jewelry_upload_id
    ).first()
    
    if not upload:
        raise HTTPException(status_code=404, detail="Jewelry upload not found")

    
    images = db.query(JewelryImage).filter(
        JewelryImage.jewelry_upload_id == product_data.jewelry_upload_id
    ).all()

    if not images:
        raise HTTPException(status_code=404, detail="No images found for this upload")

    
    try:
        for image in images:
            product = db.query(Product).filter(
                Product.jewelry_image_id == image.id
            ).first()

            if product:
                product.product_type = product_data.product_type
            else:
                product = Product(
                    jewelry_image_id=image.id,
                    product_type=product_data.product_type
                )
                db.add(product)
        
        db.commit()
        return {"message": f"Product type updated for {len(images)} images"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating products: {str(e)}")