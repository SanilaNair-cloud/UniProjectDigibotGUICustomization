# backend/models.py
from sqlalchemy import Column, Integer, String
from database import Base

class AdminSettings(Base):
    __tablename__ = "admin_settings"
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, index=True)        
    admin_email = Column(String, index=True)         
    logo = Column(String)
    background_color = Column(String)
    font_style = Column(String)
    font_size = Column(String)
    text_color = Column(String)
    alignment = Column(String)
    custom_audience = Column(String)
    tone = Column(String)
