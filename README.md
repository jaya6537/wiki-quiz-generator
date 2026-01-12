# Wiki Quiz Generator

A full-stack application that generates quizzes from Wikipedia articles using AI.

## Features

- Scrape Wikipedia articles using BeautifulSoup
- Generate multiple-choice quizzes using AI (currently mocked for demo)
- Store quiz data in SQLite database
- Clean React frontend with tabs for quiz generation and history
- RESTful API with FastAPI

## Setup

### Prerequisites

- Python 3.8+
- Node.js 16+

### Backend Setup

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the backend:
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

The frontend will be available at http://localhost:3000

## API Endpoints

- `POST /generate-quiz` - Generate a quiz from a Wikipedia URL (expects JSON: {"url": "https://..."})
- `GET /quizzes` - Get list of all quizzes
- `GET /quiz/{id}` - Get full quiz details

## LangChain Prompt Template

The quiz generation uses the following prompt (currently mocked):

```
Based on the following Wikipedia article content, generate a quiz with 5-10 multiple-choice questions.
Each question should have:
- Question text
- Four options (A-D)
- Correct answer (exact text from options)
- Difficulty level (easy, medium, hard)
- Short explanation (why this is correct, referencing the article)

Also, suggest 3-5 related Wikipedia topics for further reading.

Article Content:
{content}

Output the result as a JSON object with keys:
- "quiz": array of question objects
- "related_topics": array of topic strings

Each question object should have: "question", "options" (array), "answer", "difficulty", "explanation"
```

## Database

Uses SQLite (wiki_quiz.db) for local development. PostgreSQL is used in production (Render).

## Deployment to Render

### Prerequisites

1. A GitHub account with this repository
2. A Render account (free tier available)
3. A Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Steps

1. **Push your code to GitHub** (already done if you're reading this)

2. **Create a Render account** and connect your GitHub repository

3. **Create a PostgreSQL Database**:
   - In Render dashboard, click "New +" → "PostgreSQL"
   - Name it `wiki-quiz-db`
   - Select the free plan
   - Note: The database will be automatically linked via `render.yaml`

4. **Deploy the Web Service**:
   - Option A: Use `render.yaml` (recommended)
     - In Render dashboard, click "New +" → "Blueprint"
     - Connect your GitHub repository
     - Render will automatically detect `render.yaml` and deploy
   - Option B: Manual setup
     - Click "New +" → "Web Service"
     - Connect your GitHub repository
     - Settings:
       - **Name**: `wiki-quiz-backend`
       - **Environment**: `Python 3`
       - **Build Command**: `pip install -r backend/requirements.txt`
       - **Start Command**: `cd backend && python run.py`
       - **Plan**: Free (or upgrade for production)

5. **Set Environment Variables**:
   - In your Render service settings, add:
     - `GEMINI_API_KEY`: Your Google Gemini API key
     - `DATABASE_URL`: Automatically set by Render if using PostgreSQL database

6. **Update Frontend**:
   - Update your frontend API URL to point to your Render backend URL
   - Example: `https://wiki-quiz-backend.onrender.com`

### Environment Variables

- `GEMINI_API_KEY`: Required - Your Google Gemini API key
- `DATABASE_URL`: Automatically provided by Render for PostgreSQL
- `PORT`: Automatically set by Render (defaults to 8001 locally)

## Testing

1. Use the URLs in `sample_data/` for testing
2. Check API responses match the sample JSON outputs
3. Verify database storage and retrieval

## Screenshots

(Add screenshots here after testing)