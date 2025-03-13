from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.engraving_detail import EngravingDetail as EngravingDetailModel
from models.jewelry_image import JewelryImage
from schemas.engraving import EngravingDetailCreate, EngravingDetailResponse
from utils.database import get_db

router = APIRouter(prefix="/engraving-details", tags=["engraving"])

@router.post("/", response_model=EngravingDetailResponse)
def create_engraving_detail(
    engraving_data: EngravingDetailCreate, 
    db: Session = Depends(get_db)
):
    
    image = db.query(JewelryImage).get(engraving_data.jewelry_image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Jewelry image not found")
    
    
    db_engraving = EngravingDetailModel(
        jewelry_image_id=engraving_data.jewelry_image_id,
        total_lines=engraving_data.total_lines
    )
    
    db.add(db_engraving)
    try:
        db.commit()
        db.refresh(db_engraving)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    return db_engraving

@router.get("/image/{jewelry_image_id}", response_model=list[EngravingDetailResponse])
def get_engraving_history(jewelry_image_id: int, db: Session = Depends(get_db)):
    image = db.query(JewelryImage).get(jewelry_image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Jewelry image not found")
    
    return image.engraving_details