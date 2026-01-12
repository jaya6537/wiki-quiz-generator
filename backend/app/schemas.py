from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class GenerateQuizRequest(BaseModel):
    url: str

class QuizItem(BaseModel):
    question: str
    options: List[str]
    answer: str
    difficulty: str
    explanation: str

class QuizResponse(BaseModel):
    id: int
    url: str
    title: str
    sections: Optional[List[str]] = None
    summary: str
    quiz: List[QuizItem]
    related_topics: List[str]
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class QuizListItem(BaseModel):
    id: int
    url: str
    title: str
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True
