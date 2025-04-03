# schemas.py
from pydantic import BaseModel

class FeedbackSchema(BaseModel):
    rating: int
    text: str
    company_id: str

    class Config:
        from_attributes = True  # For Pydantic v2

class AuthResponse(BaseModel):
    user_id: str
    user_type: str
    company_id: str
    company_name: str
    chatbot_url: str
