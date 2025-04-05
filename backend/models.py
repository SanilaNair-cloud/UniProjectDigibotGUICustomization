
from sqlalchemy import Column, Integer, String, Float
from database import Base

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer)
    text = Column(String)
    created_at = Column(String)
    company_id = Column(String)
    sentiment = Column(String)  
    sentiment_score = Column(Float)  

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
    company_id = Column(String)
