from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, crud, database
from .scraper import scrape_wikipedia
from .llm import generate_quiz_and_topics
import json

app = FastAPI(title="Wiki Quiz Generator API")

@app.on_event("startup")
def startup_event():
    models.Base.metadata.create_all(bind=database.engine)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
# models.Base.metadata.create_all(bind=database.engine)  # Moved to startup event

@app.post("/generate-quiz", response_model=schemas.QuizResponse)
async def generate_quiz(request: schemas.GenerateQuizRequest, db: Session = Depends(database.get_db)):
    print(f"🎯 Generating quiz for URL: {request.url}")
    
    # Check if URL already exists
    existing = crud.get_quiz_by_url(db, request.url)
    if existing:
        print("📋 Found existing quiz in database")
        return existing

    try:
        print("🌐 Scraping Wikipedia article...")
        # Scrape the article
        scraped_data = scrape_wikipedia(request.url)
        print(f"✅ Scraped {len(scraped_data['content'])} characters of content")
        
        print("🤖 Generating quiz using AI...")
        # Generate quiz using LLM
        quiz_data = generate_quiz_and_topics(scraped_data['content'])
        print(f"📝 Generated quiz with {len(quiz_data.get('quiz', []))} questions")
        
        # Combine data
        full_data = {
            **scraped_data,
            **quiz_data
        }
        
        print("💾 Saving to database...")
        # Store in database
        quiz = crud.create_quiz(db, full_data)
        print("✅ Quiz saved successfully!")
        
        return quiz
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {str(e)}")

@app.get("/quizzes", response_model=list[schemas.QuizListItem])
async def get_quizzes(db: Session = Depends(database.get_db)):
    quizzes = crud.get_all_quizzes(db)
    return quizzes

@app.get("/quiz/{quiz_id}", response_model=schemas.QuizResponse)
async def get_quiz(quiz_id: int, db: Session = Depends(database.get_db)):
    quiz = crud.get_quiz(db, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz