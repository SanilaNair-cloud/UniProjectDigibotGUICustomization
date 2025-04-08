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
from models import Feedback, AdminSettings
from schemas import FeedbackSchema, AuthResponse
from textblob import TextBlob
from database import Base, engine
from fastapi.security import OAuth2PasswordBearer
from fastapi import Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security = HTTPBearer()

KEY_DIR = os.path.join(os.path.dirname(__file__), "keys")
with open(os.path.join(KEY_DIR, "private.pem"), "r") as f:
    PRIVATE_KEY = f.read()
with open(os.path.join(KEY_DIR, "public.pem"), "r") as f:
    PUBLIC_KEY = f.read()

ALGORITHM = "RS256"

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")



app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



Base.metadata.create_all(bind=engine)



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
    
""" Data solution Part"""
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="superadmin-auth")

def verify_superadmin_token(token: str = Depends(oauth2_scheme)):
    payload = verify_jwt_token(token)
    #print("🔑 Payload:", payload);
    if payload["user_type"] != "superadmin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return payload

def analyze_sentiment(text):
    polarity = TextBlob(text).sentiment.polarity
    if polarity > 0.2:
        return "Positive", polarity
    elif polarity < -0.2:
        return "Negative", polarity
    else:
        return "Neutral", polarity


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
    user_id = "amrit12@example.com"
    user_type = "admin"
    company_id = "amr123"
    company_name = "AMT123"
    token = create_jwt_token(user_id, user_type, company_id, company_name)
    return RedirectResponse(url=f"http://localhost:3000/company-portal?auth={token}")

@app.get("/admin-settings/{company_id}")
def get_admin_settings(company_id: str, db: Session = Depends(get_db)):
    settings = db.query(AdminSettings).filter(AdminSettings.company_id == company_id).first()
    print("REturned logo:", settings.logo)
    print("🧾 Returned background_color:", settings.background_color)

    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings

@app.post("/chat")
async def relay_to_webhook(request: Request, db: Session = Depends(get_db)):
    body = await request.json()

    company_id = body.get("company_id")
    if not company_id:
        raise HTTPException(status_code=400, detail="Missing company_id")

    
    settings = db.query(AdminSettings).filter(AdminSettings.company_id == company_id).first()
    audience = settings.custom_audience if settings else "N/A"
    tone = settings.tone if settings else "N/A"
    body["tone"] = tone
    body["custom_audience"] = audience

    """
    async with httpx.AsyncClient() as client:
        
        response = await client.post(
            "https://automate.digimark.com.au/webhook/9fa58f14-8ac3-42f4-a095-c6db67b61558",
            json=body
        )
    print("👉 Final response to frontend:", response.json())

    return response.json()
    """
    #  Temporarily mocking the reply while n8n webhook is not ready
    mock_reply = f"""⚠️ This is a test response. The production webhook is not yet active.

    🎯 Audience: {settings.custom_audience or "N/A"}  
    🗣️ Tone: {settings.tone or "N/A"}

    Once the real webhook is ready, this will return intelligent AI generated responses.
    """
    return { "reply": mock_reply }

    


   


@app.post("/feedback")
def save_feedback(feedback: FeedbackSchema, db: Session = Depends(get_db)):
    sentiment_label, sentiment_score = analyze_sentiment(feedback.text)

    new_feedback = Feedback(
        rating=feedback.rating,
        text=feedback.text,
        company_id=feedback.company_id,
        created_at=datetime.utcnow().isoformat(),
        sentiment=sentiment_label,           # ✅ Save sentiment
        sentiment_score=sentiment_score      # ✅ Save score
    )

    db.add(new_feedback)
    db.commit()
    print("✅ Feedback saved with sentiment:", feedback)
    return {"message": "Feedback and sentiment saved successfully!"}

"""Data science solution part"""

@app.post("/superadmin-auth")
def superadmin_auth(email: str = Form(...)):
    if email == "digimark@admin.com":
        token = create_jwt_token(email, "superadmin", "digimark", "DigiMark")
        return {"auth": token}
    raise HTTPException(status_code=403, detail="Only DigiMark Super Admin is allowed")


@app.get("/admin-settings-all")
def get_all_companies(db: Session = Depends(get_db)):
    results = db.query(AdminSettings.company_id, AdminSettings.company_name).distinct().all()
    print("📦 All companies fetched:", results)
    return [{"company_id": cid, "company_name": cname} for cid, cname in results]



    
@app.get("/feedback-all")
def get_all_feedback(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    token = credentials.credentials
    payload = verify_jwt_token(token)

    if payload["user_type"] != "superadmin":
        raise HTTPException(status_code=403, detail="Not authorized")

    feedback = db.query(Feedback).all()
    return [
        {
            "id": f.id,
            "rating": f.rating,
            "text": f.text,
            "created_at": f.created_at,
            "company_id": f.company_id,
            "sentiment": f.sentiment,
            "sentiment_score": f.sentiment_score,
        }
        for f in feedback
    ]


