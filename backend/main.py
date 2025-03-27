from fastapi import FastAPI
import uvicorn 
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware 
from routes.jewelry import router as jewelry_router
from routes.product import router as product_router
from routes.mail import router as mail_router
from routes.user_flow import router as user_flow_router
from routes.engraving import router as engraving_router
from routes.auth import router as auth_router
from models.user import User
import os
from routes.engraving_lines import router as engraving_lines_router
from utils.database import Base, engine, SessionLocal
from utils.auth import get_password_hash  
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel, OAuth2 as OAuth2Model
from fastapi.openapi.utils import get_openapi
from utils.database import create_database_if_not_exists, Base, engine, SessionLocal

app = FastAPI()
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Your API",
        version="1.0.0",
        description="API with OAuth2 Bearer Token",
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    openapi_schema["security"] = [{"OAuth2PasswordBearer": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
app.add_middleware( 
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
static_files = StaticFiles(directory="uploads")
static_with_cors = CORSMiddleware(
    static_files,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="uploads"), name="uploads")
app.include_router(jewelry_router, prefix="/api")  
app.include_router(product_router, prefix="/api")
app.include_router(engraving_router, prefix="/api")
app.include_router(engraving_lines_router, prefix="/api")
app.include_router(auth_router, prefix="/api") 
app.include_router(mail_router, prefix="/api")
app.include_router(user_flow_router, prefix="/api")



@app.on_event("startup")
async def startup_event():
    try:
        create_database_if_not_exists() 
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully.")
        db = SessionLocal()
        admin_email = os.getenv("ADMIN_EMAIL", "admin@example.com")
        admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
        
        if not db.query(User).filter(User.email == admin_email).first():
            hashed_pw = get_password_hash(admin_password)
            admin_user = User(
                name="Super Admin",
                email=admin_email,
                password_hash=hashed_pw,
                provider='email',
                role="super_admin"
            )
            db.add(admin_user)
            db.commit()
            print("Admin Created...")
    except Exception as e:
        print(f"Error creating database tables: {e}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)