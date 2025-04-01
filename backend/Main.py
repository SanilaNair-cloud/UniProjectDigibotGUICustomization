from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import Session
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi import FastAPI, Request
import httpx
from fastapi.responses import RedirectResponse
from database import SessionLocal, Base, engine
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import jwt
import os
from fastapi import File, UploadFile, Form
import shutil
from fastapi.staticfiles import StaticFiles


KEY_DIR = os.path.join(os.path.dirname(__file__), "keys")
with open(os.path.join(KEY_DIR, "private.pem"), "r") as f:
    PRIVATE_KEY = f.read()
with open(os.path.join(KEY_DIR, "public.pem"), "r") as f:
    PUBLIC_KEY = f.read()

ALGORITHM = "RS256"





app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AdminSettings(Base):
    __tablename__ = "admin_settings"
    id = Column(Integer, primary_key=True, index=True)
    logo = Column(String)
    background_color = Column(String)
    font_style = Column(String)
    font_size = Column(String)
    text_color = Column(String)
    alignment = Column(String)
    custom_audience = Column(String)
    tone = Column(String)
    admin_id = Column(String)
    company_name = Column(String)
    company_id = Column(String)  # ✅ Newly added


Base.metadata.create_all(bind=engine)


class AuthResponse(BaseModel):
    user_id: str
    user_type: str
    chatbot_url: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_jwt_token(user_id: str, user_type: str, company_id: str, company_name: str):
    payload = {
        "user_id": user_id,
        "user_type": user_type,
        "company_id": company_id,
        "company_name": company_name,
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    return jwt.encode(payload, PRIVATE_KEY, algorithm=ALGORITHM)

def verify_jwt_token(token: str):
    try:
        return jwt.decode(token, PUBLIC_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=403, detail="Invalid token")



@app.post("/admin-settings/")
async def save_or_update_admin_settings(
    logo: UploadFile = File(...),
    background_color: str = Form(...),
    font_style: str = Form(...),
    font_size: str = Form(...),
    text_color: str = Form(...),
    alignment: str = Form(...),
    custom_audience: str = Form(...),
    tone: str = Form(...),
    admin_id: str = Form(...),
    company_name: str = Form(...),
    company_id: str = Form(...),
    db: Session = Depends(get_db)
):
    uploads_dir = os.path.join(os.getcwd(), "uploads")
    os.makedirs(uploads_dir, exist_ok=True)

    logo_filename = f"{company_id}_{logo.filename}"
    file_path = os.path.join(uploads_dir, logo_filename)

    with open(file_path, "wb") as f:
        f.write(await logo.read())

  
    existing_settings = db.query(AdminSettings).filter(AdminSettings.company_id == company_id).first()

    if existing_settings:
      
        existing_settings.logo = logo_filename
        existing_settings.background_color = background_color
        existing_settings.font_style = font_style
        existing_settings.font_size = font_size
        existing_settings.text_color = text_color
        existing_settings.alignment = alignment
        existing_settings.custom_audience = custom_audience
        existing_settings.tone = tone
        existing_settings.admin_id = admin_id
        existing_settings.company_name = company_name
    else:
    
        new_settings = AdminSettings(
            logo=logo_filename,
            background_color=background_color,
            font_style=font_style,
            font_size=font_size,
            text_color=text_color,
            alignment=alignment,
            custom_audience=custom_audience,
            tone=tone,
            admin_id=admin_id,
            company_name=company_name,
            company_id=company_id
        )
        db.add(new_settings)

    db.commit()
    return {"message": "Admin settings saved successfully!"}


class AuthResponse(BaseModel):
    user_id: str
    user_type: str
    company_id: str
    company_name: str
    chatbot_url: str

@app.get("/auth", response_model=AuthResponse)
def authenticate_user(auth: str = Query(...)):
    payload = verify_jwt_token(auth)
    return {
        "user_id": payload["user_id"],
        "user_type": payload["user_type"],
        "company_id": payload["company_id"],      
        "company_name": payload["company_name"],  
        "chatbot_url": "http://localhost:3000/FullPageDigibot"
    }


@app.get("/")
def root_redirect():
    user_id = "usertwbm123@example.com"
    user_type = "user"
    company_id = "twmba123"
    company_name = "Toowoomba"
    token = create_jwt_token(user_id, user_type, company_id, company_name)
    return RedirectResponse(url=f"http://localhost:3000/company-portal?auth={token}")

@app.get("/admin-settings/{company_id}")
def get_admin_settings(company_id: str, db: Session = Depends(get_db)):
    settings = db.query(AdminSettings).filter(AdminSettings.company_id == company_id).first()
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings

@app.post("/chat")
async def relay_to_webhook(request: Request):
    body = await request.json()

    async with httpx.AsyncClient() as client:
       
        response = await client.post("http://localhost:4000/webhook", json=body)
        
        # ✅ Forward to Webhook.site (logging only)
        await client.post(
            "https://webhook.site/4c443290-9e27-4b4a-b719-cb5e5f1aded5",  
            json=body
        )

    return response.json()