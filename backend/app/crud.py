from sqlalchemy.orm import Session
from . import models, schemas
from typing import List

def get_quiz_by_url(db: Session, url: str):
    return db.query(models.Quiz).filter(models.Quiz.url == url).first()

def create_quiz(db: Session, quiz_data: dict):
    db_quiz = models.Quiz(
        url=quiz_data['url'],
        title=quiz_data['title'],
        sections=quiz_data['sections'],
        summary=quiz_data['summary'],
        quiz=quiz_data['quiz'],
        related_topics=quiz_data['related_topics']
    )
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    return db_quiz

def get_all_quizzes(db: Session) -> List[models.Quiz]:
    return db.query(models.Quiz).all()

def get_quiz(db: Session, quiz_id: int):
    return db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()