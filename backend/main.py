from fastapi import FastAPI
import uvicorn 
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware 
from routes.jewelry import router as jewelry_router
from routes.product import router as product_router
from routes.engraving import router as engraving_router
from routes.engraving_lines import router as engraving_lines_router
from utils.database import Base, engine

app = FastAPI()
app.add_middleware( 
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="uploads"), name="uploads")
app.include_router(jewelry_router, prefix="/api")  
app.include_router(product_router, prefix="/api")
app.include_router(engraving_router, prefix="/api")
app.include_router(engraving_lines_router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully.")
    except Exception as e:
        print(f"Error creating database tables: {e}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)