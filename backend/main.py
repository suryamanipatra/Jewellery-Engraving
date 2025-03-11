from fastapi import FastAPI
import uvicorn 
from starlette.middleware.cors import CORSMiddleware 
from routes.jewelry import app as jewelry_api
from utils.database import Base, engine

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/api", jewelry_api)

@app.on_event("startup")
async def startup_event():
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully.")
    except Exception as e:
        print(f"Error creating database tables: {e}")

if __name__ == "__main__":
    
    uvicorn.run(app, host="0.0.0.0", port=8000)