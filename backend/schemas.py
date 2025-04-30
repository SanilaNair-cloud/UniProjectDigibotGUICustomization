"""
schema.py is Pydantic Models for DigiBot API

This module defines the data validation and serialization schemas 
used in FastAPI endpoints for the DigiBot platform.

Schemas:
- FeedbackSchema: Validates user feedback submissions.
- AuthResponse: Structures data returned after successful authentication.

These models promote data consistency between the frontend and backend.
"""

from pydantic import BaseModel

class FeedbackSchema(BaseModel):
    """
    Represents the structure of user-submitted feedback.

    Attributes:
        rating (int): Numerical score provided by the user.
        text (str): Optional written feedback or comment.
        company_id (str): The identifier of the company submitting or receiving the feedback.
    """
    rating: int
    text: str
    company_id: str

    class Config:
        from_attributes = True  


class AuthResponse(BaseModel):
    """
    Represents the authentication response payload after JWT verification.

    Attributes:
        user_id (str): Unique identifier of the authenticated user.
        user_type (str): Type or role of the user (e.g., admin, staff).
        company_id (str): Identifier of the user's associated company.
        company_name (str): Display name of the company.
        chatbot_url (str): URL endpoint to access the chatbot.
    """
    user_id: str
    user_type: str
    company_id: str
    company_name: str
    chatbot_url: str
