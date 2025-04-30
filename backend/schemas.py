"""
schemas.py – Pydantic Models for DigiBot API

Defines request and response data schemas used in FastAPI endpoints:
- FeedbackSchema: for validating user-submitted feedback
- AuthResponse: for structuring the authentication response after JWT verification

These models ensure data consistency between frontend and backend during API communication.
"""
from pydantic import BaseModel

class FeedbackSchema(BaseModel):
    rating: int
    text: str
    company_id: str

    class Config:
        from_attributes = True  


class AuthResponse(BaseModel):
    user_id: str
    user_type: str
    company_id: str
    company_name: str
    chatbot_url: str
