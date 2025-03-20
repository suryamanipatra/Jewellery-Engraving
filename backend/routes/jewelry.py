from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from PIL import Image
from io import BytesIO
import os
import uuid
from schemas.jewelry_upload import JewelryUploadCreate
from models.jewelry_upload import JewelryUpload
from models.user import User
from schemas.jewelry_upload import JewelryUpload as JewelryUploadSchema
from schemas.jewelry_image import JewelryImage as JewelryImageSchema
from models.jewelry_image import JewelryImage
from utils.database import get_db
from utils.dependencies import get_current_user

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/uploads/{image_filename}")
async def get_uploaded_image(image_filename: str):
    file_path = os.path.join(UPLOAD_DIR, image_filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")
    
    return FileResponse(file_path)

@router.post("/jewelry-uploads/")
async def create_upload(
    user_id: int = Form(...),
    upload_source: str = Form(...),
    files: list[UploadFile] = File(...),
    view_types: list[str] = Form(...),
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user)
):
    try:
        if not files:
            raise HTTPException(status_code=400, detail="No files uploaded")
        if len(files) != len(view_types):
            raise HTTPException(status_code=400, detail="Mismatched files and view types")
        print(files)
        jewelry_name = os.path.splitext(files[0].filename)[0]  
        db_upload = JewelryUpload(
            # user_id=current_user,
            user_id=user_id,
            jewelry_name=jewelry_name,
            upload_source=upload_source
        )
        db.add(db_upload)
        db.flush()
        images = []
        for file, view_type in zip(files, view_types):
            if view_type not in ['front', 'side', 'angled', 'top']:
                raise HTTPException(status_code=400, detail=f"Invalid view type: {view_type}")
            contents = await file.read()
            try:
                with Image.open(BytesIO(contents)) as img:
                    width, height = img.size
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")

            
            file_ext = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_ext}"
            file_path = os.path.join(UPLOAD_DIR, unique_filename)
            
            with open(file_path, "wb") as buffer:
                buffer.write(contents)

            
            db_image = JewelryImage(
                jewelry_upload_id=db_upload.id,
                view_type=view_type,
                image_width=width,
                image_height=height,
                file_path=unique_filename
            )
            db.add(db_image)
            images.append(db_image)
        db.commit()
        db.refresh(db_upload)
        upload_schema = JewelryUploadSchema.from_orm(db_upload)
        image_schemas = [JewelryImageSchema.from_orm(img) for img in images]
        print(f"Created jewelry upload: {upload_schema.dict()}")
        print(f"Created images: {[img.dict() for img in image_schemas]}")
        return {
            "upload": upload_schema.dict(),
            "images": [img.dict() for img in image_schemas]
        }

    except Exception as e:
        print(f"Error creating jewelry upload: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


