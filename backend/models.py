"""
Database Models for DigiBot

Defines the structure of database tables using SQLAlchemy ORM.

Tables:
- Feedback: Stores user-submitted feedback and sentiment analysis results.
- AdminSettings: Stores customization settings for each admin/company chatbot interface.
"""

from sqlalchemy import Column, Integer, String, Float
from database import Base

class Feedback(Base):
    """
    Feedback table for storing user reviews.

    Columns:
    - id: Primary key.
    - rating: Numerical rating given by the user.
    - text: Written comment or feedback.
    - created_at: Timestamp of when the feedback was submitted.
    - company_id: Identifier of the company receiving the feedback.
    - sentiment: Detected sentiment (e.g., Positive, Negative).
    - sentiment_score: Sentiment strength as a float (e.g., confidence score).
    """
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer)
    text = Column(String)
    created_at = Column(String)
    company_id = Column(String)
    sentiment = Column(String)  
    sentiment_score = Column(Float)  


class AdminSettings(Base):
    """
    Admin settings table for chatbot UI customization.

    Columns:
    - id: Primary key.
    - logo: URL or path to the uploaded logo.
    - background_color: Background color of the chatbot interface.
    - font_style: Selected font type (e.g., Arial, Roboto).
    - font_size: Font size for chatbot text.
    - text_color: Font color for displayed text.
    - alignment: Text alignment setting.
    - custom_audience: Description of the intended audience.
    - tone: Chatbot tone (e.g., Friendly, Formal).
    - admin_id: ID of the admin user who customized the settings.
    - company_name: Name of the associated company.
    - company_id: Unique identifier of the company.
    """
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
    company_id = Column(String)
