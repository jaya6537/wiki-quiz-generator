from pydantic import BaseModel
from typing import List, Dict, Any, Optional
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
    sections: List[str]
    summary: str
    quiz: List[QuizItem]
    related_topics: List[str]
    created_at: datetime

class QuizListItem(BaseModel):
    id: int
    url: str
    title: str
    created_at: datetime