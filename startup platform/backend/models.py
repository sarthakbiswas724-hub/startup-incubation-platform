from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False)  
    applications = relationship("StartupApplication", back_populates="founder", cascade="all, delete-orphan")


class StartupApplication(Base):
    __tablename__ = "startup_applications"

    id = Column(Integer, primary_key=True, index=True)
    startup_name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    industry_sector = Column(String, nullable=False)
    
    
    pitch_deck_url = Column(String, nullable=False) 
    business_plan_url = Column(String, nullable=True)
    
    status = Column(String, default="Pending")  
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    
    founder_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    founder = relationship("User", back_populates="applications")