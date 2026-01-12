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

## Deployment Guide

### Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name it `wiki-quiz-generator`
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/wiki-quiz-generator.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy Backend to Render

#### Prerequisites
- GitHub repository (from Step 1)
- Render account: https://render.com
- Gemini API key: https://aistudio.google.com/app/apikey

#### Option A: Using Blueprint (Recommended)

1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub account and select `wiki-quiz-generator`
4. Render will detect `render.yaml` and create:
   - PostgreSQL database (`wiki-quiz-db`)
   - Web service (`wiki-quiz-backend`)
5. **Add Environment Variable**:
   - Go to your web service → Environment tab
   - Add `GEMINI_API_KEY` with your API key value
   - Click "Save Changes"
6. Wait for deployment to complete
7. **Note your backend URL**: `https://wiki-quiz-backend.onrender.com` (or your custom name)

#### Option B: Manual Setup

1. **Create PostgreSQL Database**:
   - Click "New +" → "PostgreSQL"
   - Name: `wiki-quiz-db`
   - Plan: Free
   - Click "Create Database"
   - Copy the "Internal Database URL"

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - **Name**: `wiki-quiz-backend`
     - **Environment**: `Python 3`
     - **Region**: Choose closest to you
     - **Branch**: `main` (or `master`)
     - **Root Directory**: (leave empty)
     - **Build Command**: `pip install -r backend/requirements.txt`
     - **Start Command**: `cd backend && python run.py`
     - **Plan**: Free
   - Click "Create Web Service"

3. **Add Environment Variables**:
   - Go to Environment tab
   - Add:
     - Key: `GEMINI_API_KEY`, Value: (your API key)
     - Key: `DATABASE_URL`, Value: (from PostgreSQL database)
   - Click "Save Changes"

4. Wait for deployment to complete
5. **Note your backend URL**: `https://wiki-quiz-backend.onrender.com`

### Step 3: Deploy Frontend to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Import Project**:
   - Click "Add New..." → "Project"
   - Select your `wiki-quiz-generator` repository
   - Configure:
     - **Framework Preset**: Create React App
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
4. **Add Environment Variable**:
   - Go to Settings → Environment Variables
   - Add:
     - Key: `REACT_APP_API_URL`
     - Value: `https://wiki-quiz-backend.onrender.com` (your Render backend URL)
   - Click "Save"
5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend will be live at: `https://your-project.vercel.app`

### Environment Variables Summary

**Render (Backend)**:
- `GEMINI_API_KEY`: Your Google Gemini API key (required)
- `DATABASE_URL`: Automatically set by Render for PostgreSQL
- `PORT`: Automatically set by Render

**Vercel (Frontend)**:
- `REACT_APP_API_URL`: Your Render backend URL (e.g., `https://wiki-quiz-backend.onrender.com`)

## Testing

1. Use the URLs in `sample_data/` for testing
2. Check API responses match the sample JSON outputs
3. Verify database storage and retrieval

## Screenshots

(Add screenshots here after testing)