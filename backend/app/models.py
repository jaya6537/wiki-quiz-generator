from sqlalchemy import Column, Integer, String, Text, JSON, DateTime
from sqlalchemy.sql import func
from .database import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    title = Column(String)
    sections = Column(JSON)
    summary = Column(Text)
    quiz = Column(JSON)
    related_topics = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())