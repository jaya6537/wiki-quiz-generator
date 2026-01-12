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

Uses SQLite (wiki_quiz.db) for simplicity. Tables are created automatically.

## Testing

1. Use the URLs in `sample_data/` for testing
2. Check API responses match the sample JSON outputs
3. Verify database storage and retrieval

## Screenshots

(Add screenshots here after testing)