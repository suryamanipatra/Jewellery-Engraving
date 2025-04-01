from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.engraving_detail import EngravingDetail as EngravingDetailModel
from models.jewelry_image import JewelryImage
from schemas.engraving import EngravingDetailCreate, EngravingDetailResponse
from utils.database import get_db
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/engraving-details", tags=["engraving"])

@router.post("/", response_model=EngravingDetailResponse)
def create_or_update_engraving_detail(
    engraving_data: EngravingDetailCreate, 
    db: Session = Depends(get_db)
):
    try:
        image = db.query(JewelryImage).get(engraving_data.jewelry_image_id)
        if not image:
            raise HTTPException(status_code=404, detail="Jewelry image not found")

        db_engraving = db.query(EngravingDetailModel).filter_by(
            jewelry_image_id=engraving_data.jewelry_image_id
        ).first()

        if db_engraving:
            db_engraving.total_lines = engraving_data.total_lines
        else:
            db_engraving = EngravingDetailModel(
                jewelry_image_id=engraving_data.jewelry_image_id,
                total_lines=engraving_data.total_lines
            )
            db.add(db_engraving)

        db.commit()
        db.refresh(db_engraving)
        return db_engraving

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database integrity error")

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



@router.get("/image/{jewelry_image_id}", response_model=list[EngravingDetailResponse])
def get_engraving_history(jewelry_image_id: int, db: Session = Depends(get_db)):
    image = db.query(JewelryImage).get(jewelry_image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Jewelry image not found")
    
    return image.engraving_details