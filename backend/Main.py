"""
main.py – DigiBot Backend API

This script contains the backend endpoints for the below functionalities:
 Company SSO authentication and JWT-based access control
- Admin settings configuration for customizing DigiBot UI (branding of UI , tone and audience)
- Feedback collection and sentiment analysis using TextBlob
- Internal staff UI and public-facing DigiBot integration via webhook relay
- Superadmin authentication and access to the sentiment analytics dashboard
- Static file handling for uploaded company logos
- Redirect functionality for testing/demo purposes

Note:
Both the public-facing DigiBot UI (embedded in client portals) and the internal staff UI rely on webhook communication 
with an n8n workflow for query processing. While the POST request to the production webhook is not yet functional
 (pending client setup), the integration is implemented and tested with a mocked response. 
 The system is fully prepared to switch to the live workflow once available.

Developed with FastAPI + PostgreSQL + TextBlob
Author: [TechSphereTeam]
"""

# ----------------------------
# Importing required libraries
# ----------------------------
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


# for swagger UI to test endpoints
tags_metadata = [
    {
        "name": "Authentication – Company SSO",
        "description": "SSO-based login for company admins/users. JWT-based token generation and validation for accessing DigiBot."
    },
    {
        "name": "Authentication – DigiMark Admin Login",
        "description": "Secure login for DigiMark Super Admin to access internal sentiment dashboard. JWT-based access control."
    },
    {
        "name": "Admin Settings",
        "description": "Admin customization of chatbot UI (logo, colors, fonts, tone, audience). Stored via multipart form data."
    },
    {
        "name": "Chatbot – Relay & Webhook",
        "description": "Sends user queries to webhook server. Uses admin settings (audience/tone) for context enrichment."
    },
    {
        "name": "Feedback",
        "description": "Stores ratings and comments from users. Performs sentiment analysis using TextBlob NLP and stores scores."
    },
    {
        "name": "Data Science Dashboard",
        "description": "APIs supporting DigiMark sentiment dashboard: sentiment scores, feedback aggregation, company-wise analysis."
    },
    {
        "name": "Company Info",
        "description": "Fetches all company metadata (company ID and name) for dashboard filtering and selection."
    },
    {
        "name": "Digibot – Redirect",
        "description": "Redirects to the chatbot demo UI with pre-generated token for testing/demo purposes."
    }
]
# Enables HTTP Bearer token security for routes that require JWT authentication
# (currently used for protecting superadmin-only access to feedback data)
security = HTTPBearer()

# Load RSA key(public,private) pair for signing and verifying JWT tokens
KEY_DIR = os.path.join(os.path.dirname(__file__), "keys")
with open(os.path.join(KEY_DIR, "private.pem"), "r") as f:
    PRIVATE_KEY = f.read()
with open(os.path.join(KEY_DIR, "public.pem"), "r") as f:
    PUBLIC_KEY = f.read()

# Algorithm used for JWT encoding/decoding
ALGORITHM = "RS256"

# ----------------------------
# FastAPI Application Metadata
# ----------------------------

app = FastAPI(
    title="DigiBot API",
    description="Backend APIs for DigiBot – public UI, internal staff UI, and DigiMark admin dashboard.",
    version="1.0.0",
    openapi_tags=tags_metadata,
    license_info={
        "name": "DigiMark Internal License",
        "url": "https://digimark.com.au/license"
    }
)


# Enable static file access (logo uploads)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")



app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# This is a temporary solution. In production, specify the allowed origins.
# For example, replace ["*"] with ["https://your-frontend-domain.com"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------------------------
# JWT token generation and verification
# -----------------------------

# Create JWT token for authenticated users
def create_jwt_token(user_id: str, user_type: str, company_id: str, company_name: str):
    payload = {
        "user_id": user_id,
        "user_type": user_type,
        "company_id": company_id,
        "company_name": company_name,
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    return jwt.encode(payload, PRIVATE_KEY, algorithm=ALGORITHM)

# Decode and verify JWT token
def verify_jwt_token(token: str):
    try:
        return jwt.decode(token, PUBLIC_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=403, detail="Invalid token")
    
# Used to validate superadmin-only routes for Data Science dashboard
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="superadmin-auth")
def verify_superadmin_token(token: str = Depends(oauth2_scheme)):
    payload = verify_jwt_token(token)
    if payload["user_type"] != "superadmin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return payload

# NLP Sentiment Analysis using TextBlob
def analyze_sentiment(text):
    polarity = TextBlob(text).sentiment.polarity
    if polarity > 0.2:
        return "Positive", polarity
    elif polarity < -0.2:
        return "Negative", polarity
    else:
        return "Neutral", polarity



# ---------------------------------------------------
# Save or update Admin UI Settings (branding typography, audience and tone)
# ---------------------------------------------------
@app.post("/admin-settings/", tags=["Admin Settings – Save"])
async def save_or_update_admin_settings(
    logo: UploadFile = File(None),  
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

    existing_settings = db.query(AdminSettings).filter(AdminSettings.company_id == company_id).first()

    logo_filename = None
    if logo:
        logo_filename = f"{company_id}_{logo.filename}"
        file_path = os.path.join(uploads_dir, logo_filename)
        with open(file_path, "wb") as f:
            f.write(await logo.read())

    if existing_settings:
        if logo_filename:
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

        db.commit()
        return {"message": "Admin settings updated successfully!"}

    else:
        new_settings = AdminSettings(
            logo=logo_filename or "",
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


# ----------------------------
# Authentication and Redirect Endpoints
# ----------------------------

class AuthResponse(BaseModel):
    user_id: str
    user_type: str
    company_id: str
    company_name: str
    chatbot_url: str

# Validates JWT and returns user info for DigiBot embedding (used by public UI)
@app.get("/auth", response_model=AuthResponse , tags=["Authentication – Company SSO"])
def authenticate_user(auth: str = Query(...)):
    payload = verify_jwt_token(auth)
    return {
        "user_id": payload["user_id"],
        "user_type": payload["user_type"],
        "company_id": payload["company_id"],      
        "company_name": payload["company_name"],  
        "chatbot_url": "http://localhost:3000/FullPageDigibot"
    }

# Redirects to the digibot UI with a generated token (for testing/demo)
@app.get("/" , tags=["Digibot – Redirect"])
def root_redirect():
    user_id = "usertwbm123@example.com"
    user_type = "admin"
    company_id = "test111"
    company_name = "Test Company"
    token = create_jwt_token(user_id, user_type, company_id, company_name)
    return RedirectResponse(url=f"http://localhost:3000/company-portal?auth={token}")

# Fetches admin settings for a specific company
@app.get("/admin-settings/{company_id}", tags=["Admin Settings – Fetch"])
def get_admin_settings(company_id: str, db: Session = Depends(get_db)):
    settings = db.query(AdminSettings).filter(AdminSettings.company_id == company_id).first()
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings

#----------------------------
# Webhook n8n workflow Relay and DigiBot Integration
# ----------------------------
@app.post("/chat" ,tags=["Digibot"])
async def relay_to_webhook(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
 
    company_id = body.get("company_id")
    if not company_id:
        raise HTTPException(status_code=400, detail="Missing company_id")
 
    settings = db.query(AdminSettings).filter(AdminSettings.company_id == company_id).first()
 
    # Safely extract tone and audience even if settings is None
    audience = settings.custom_audience if settings and settings.custom_audience else "N/A"
    tone = settings.tone if settings and settings.tone else "N/A"
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
 
    # Mock reply while webhook POST is not functional
    mock_reply = f"""⚠️ This is a test response. The production webhook is not yet active.
 
🎯 Audience: {audience}  
🗣️ Tone: {tone}
 
Once the real webhook is ready, this will return intelligent AI generated responses.
"""
    return {"reply": mock_reply}

# ----------------------------
# Feedback Handling
# ----------------------------
@app.post("/feedback",tags=["Feedback"])
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
    return {"message": "Feedback and sentiment saved successfully!"}

# ----------------------------
# Superadmin Only to aceess to access the feedback data 
# ---------------------------

# Authenticates DigiMark Super Admin and returns JWT token
@app.post("/superadmin-auth" ,tags=["Authentication – DigiMark Admin Login"])
def superadmin_auth(email: str = Form(...)):
    if email == "digimark@admin.com":
        token = create_jwt_token(email, "superadmin", "digimark", "DigiMark")
        return {"auth": token}
    raise HTTPException(status_code=403, detail="Only DigiMark Super Admin is allowed")

# # Fetches a list of all companies (used for filtering in dashboard)
@app.get("/admin-settings-all")
def get_all_companies(db: Session = Depends(get_db)):
    results = db.query(AdminSettings.company_id, AdminSettings.company_name).distinct().all()
    return [{"company_id": cid, "company_name": cname} for cid, cname in results]



 # Returns all feedback data (restricted to superadmin)    
@app.get("/feedback-all",tags=["Data Science Dashboard"])
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


