from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.engraving_line import EngravingLine
from models.engraving_detail import EngravingDetail
from schemas.engraving_line import EngravingLineCreate, EngravingLineResponse
from utils.database import get_db

router = APIRouter(prefix="/engraving-lines", tags=["engraving_lines"])

@router.post("/", response_model=EngravingLineResponse)
def create_engraving_line(
    line_data: EngravingLineCreate, 
    db: Session = Depends(get_db)
):
    engraving = db.query(EngravingDetail).get(line_data.engraving_id)
    if not engraving:
        raise HTTPException(status_code=404, detail="Engraving detail not found")
    
    
    if line_data.line_number > engraving.total_lines:
        raise HTTPException(
            status_code=400,
            detail=f"Line number exceeds total lines ({engraving.total_lines})"
        )
    
    db_line = EngravingLine(**line_data.model_dump())
    db.add(db_line)
    try:
        db.commit()
        db.refresh(db_line)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    return db_line

@router.get("/{engraving_id}", response_model=list[EngravingLineResponse])
def get_engraving_lines(engraving_id: int, db: Session = Depends(get_db)):
    engraving = db.query(EngravingDetail).get(engraving_id)
    if not engraving:
        raise HTTPException(status_code=404, detail="Engraving detail not found")
    
    return engraving.lines