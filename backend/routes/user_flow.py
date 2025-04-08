from fastapi import HTTPException, Depends, APIRouter, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from utils.database import get_db
from models.jewelry_image import JewelryImage
from models.engraving_detail import EngravingDetail
from models.product import Product
from typing import Optional, List, Dict, Any
import os

router = APIRouter(tags=["User Flow"])

UPLOADS_FOLDER = "uploads"


@router.get("/get-image", response_model=List[dict])
def get_image(jewelry_type: Optional[str] = Query(None), db: Session = Depends(get_db)):
    try:
        if not jewelry_type:  
            subquery = (
                db.query(
                    JewelryImage.jewelry_upload_id,
                    func.min(JewelryImage.id).label("min_id") 
                )
                .filter(JewelryImage.view_type == "front")
                .group_by(JewelryImage.jewelry_upload_id)
                .subquery()
            )

            images = (
                db.query(JewelryImage)
                .join(subquery, JewelryImage.id == subquery.c.min_id)
                .all()
            )

        else: 
            subquery = (
                db.query(
                    JewelryImage.jewelry_upload_id,
                    func.min(JewelryImage.id).label("min_id")
                )
                .join(Product, JewelryImage.id == Product.jewelry_image_id)
                .filter(Product.product_type == jewelry_type)
                .filter(JewelryImage.view_type == "front")
                .group_by(JewelryImage.jewelry_upload_id)
                .subquery()
            )

            images = (
                db.query(JewelryImage)
                .join(subquery, JewelryImage.id == subquery.c.min_id)
                .all()
            )

    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

    if not images:
        raise HTTPException(status_code=404, detail="No matching images found")

    return [
        {
            "id": image.id,
            "jewelry_upload_id": image.jewelry_upload_id,
            "view_type": image.view_type,
            "image_height": image.image_height,
            "image_width": image.image_width,
            "file_path": image.file_path,
            "uploaded_at": image.uploaded_at
        }
        for image in images
    ]





@router.get("/get-details", response_model=List[Dict[str, Any]])
def get_details(jewelry_upload_id: int, db: Session = Depends(get_db)):
    try:
        images = (
            db.query(JewelryImage)
            .filter(JewelryImage.jewelry_upload_id == jewelry_upload_id)
            .options(
                joinedload(JewelryImage.product),  
                joinedload(JewelryImage.engraving_details).joinedload(EngravingDetail.lines) 
            )
            .all()
        )

    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

    if not images:
        raise HTTPException(status_code=404, detail="No matching images found")

    response = []
    for image in images:      
        response.append({
            "id": image.id,
            "jewelry_upload_id": image.jewelry_upload_id,
            "view_type": image.view_type,
            "image_height": image.image_height,
            "image_width": image.image_width,
            "file_path": image.file_path,
            "uploaded_at": image.uploaded_at,
            "product": {
                "id": image.product.id if image.product else None,
                "product_type": image.product.product_type if image.product else None,
                "created_at": image.product.created_at if image.product else None
            } if image.product else None,
            "engraving_details": [
                {
                    "id": engraving.id,
                    "total_lines": engraving.total_lines,
                    "created_at": engraving.created_at,
                    "engraving_lines": [
                        {
                            "id": line.id,
                            "line_number": line.line_number,
                            "text": line.text,
                            "font_type": line.font_type,
                            "font_size": line.font_size,
                            "no_of_characters":line.no_of_characters,
                            "font_color": line.font_color,
                            "position_x": line.position_x,
                            "position_y": line.position_y,
                            "path_coordinates": line.path_coordinates,
                            "engraved_by": line.engraved_by,
                            "created_at": line.created_at,
                            "product_details":line.product_details,
                        } for line in engraving.lines
                    ]
                } for engraving in image.engraving_details
            ]
        })

    return response




@router.get("/get-file/{file_name}")
def get_file(file_name: str):
    file_path = os.path.join(UPLOADS_FOLDER, file_name)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File {file_name} not found")
    
    return FileResponse(file_path, media_type="image/jpeg", filename=file_name)