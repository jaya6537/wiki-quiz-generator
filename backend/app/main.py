from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
from . import models, schemas, crud, database
from .scraper import scrape_wikipedia
from .llm import generate_quiz_and_topics

app = FastAPI(title="Wiki Quiz Generator API")

@app.on_event("startup")
def startup_event():
    models.Base.metadata.create_all(bind=database.engine)

# CORS middleware (allow Vercel + local dev + Render)
cors_origins = [
    "http://localhost:3000",
    "https://wiki-quiz-generator.vercel.app",  # replace with your Vercel domain
]
# Add Render backend URL if provided
render_url = os.getenv("RENDER_EXTERNAL_URL")
if render_url:
    cors_origins.append(render_url)
# Add Vercel frontend URL from environment if provided
vercel_url = os.getenv("VERCEL_URL")
if vercel_url:
    # Vercel provides URL without https://, so add it
    if not vercel_url.startswith("http"):
        vercel_url = f"https://{vercel_url}"
    if vercel_url not in cors_origins:
        cors_origins.append(vercel_url)

# Note: We cannot use wildcard "*" with allow_credentials=True
# Only specific origins are allowed when credentials are enabled
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://wiki-quiz-generator-pied.vercel.app",  # your actual Vercel domain
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check for Render
@app.get("/")
def root():
    return {"status": "Wiki Quiz Backend Running"}

@app.post("/generate-quiz", response_model=schemas.QuizResponse)
async def generate_quiz(
    request: schemas.GenerateQuizRequest,
    db: Session = Depends(database.get_db)
):
    print(f"🎯 Generating quiz for URL: {request.url}")

    existing = crud.get_quiz_by_url(db, request.url)
    if existing:
        print("📋 Found existing quiz in database")
        return existing

    try:
        print("🌐 Scraping Wikipedia article...")
        scraped_data = scrape_wikipedia(request.url)
        print(f"✅ Scraped {len(scraped_data['content'])} characters")

        print("🤖 Generating quiz using AI...")
        quiz_data = generate_quiz_and_topics(scraped_data['content'])
        print(f"📝 Generated {len(quiz_data.get('quiz', []))} questions")

        full_data = {**scraped_data, **quiz_data}

        print("💾 Saving to database...")
        quiz = crud.create_quiz(db, full_data)
        print("✅ Quiz saved!")

        return quiz

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {str(e)}")

@app.get("/quizzes", response_model=list[schemas.QuizListItem])
async def get_quizzes(db: Session = Depends(database.get_db)):
    return crud.get_all_quizzes(db)

@app.get("/quiz/{quiz_id}", response_model=schemas.QuizResponse)
async def get_quiz(quiz_id: int, db: Session = Depends(database.get_db)):
    quiz = crud.get_quiz(db, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz
