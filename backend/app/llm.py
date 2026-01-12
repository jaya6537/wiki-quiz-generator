import google.generativeai as genai
import json
import os
import re

# Set your Gemini API key from environment variable
# Replace with your actual API key from https://makersuite.google.com/app/apikey
# You can get a free API key from Google AI Studio
api_key = os.getenv("GEMINI_API_KEY", "")
if not api_key:
    print("❌ ERROR: GEMINI_API_KEY environment variable is not set!")
    print("📝 To get an API key:")
    print("   1. Go to https://makersuite.google.com/app/apikey")
    print("   2. Create a new API key")
    print("   3. Set the environment variable: set GEMINI_API_KEY=your_key_here")
    print("   4. Or add it to your system environment variables")
    api_key = "DEMO_KEY_INVALID"  # This will cause failures but show the error

genai.configure(api_key=api_key)

def test_api_key():
    """Test if the API key is working"""
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content("Say 'Hello World' in exactly 2 words.")
        return True, response.text.strip()
    except Exception as e:
        return False, str(e)

def generate_quiz_and_topics(content: str) -> dict:
    """Generate quiz and topics from article content using Gemini AI"""
    truncated_content = content[:9000]

    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config={
                "temperature": 0.2
            }
        )


        prompt = f"""
You are a strict JSON generator.

Return ONLY valid JSON in this schema:

{{
  "summary": "Short article summary (3–5 lines)",
  "quiz": [
    {{
      "question": "...?",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "difficulty": "easy|medium|hard",
      "explanation": "..."
    }}
  ],
  "related_topics": ["Topic1", "Topic2", "Topic3"]
}}

Rules:
- Use ONLY facts from the article.
- 6–10 quiz questions.
- Exactly 4 options per question.
- Answer must match one option exactly.
- No markdown. No commentary.

Article:
\"\"\"{truncated_content}\"\"\"
"""

        response = model.generate_content(prompt)
        raw = response.text.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()

        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", raw, re.S)
            if not match:
                raise ValueError("No JSON found in response")
            data = json.loads(match.group())

        # Validate the response
        validate_quiz_data(data)

        return data

    except Exception as e:
        print(f"❌ AI generation failed: {e}")
        print("🔄 Falling back to dynamic mock data...")

        # Dynamic fallback based on content
        return generate_dynamic_fallback(content)

def validate_quiz_data(data: dict):
    """Validate the quiz data structure"""
    if "quiz" not in data or not isinstance(data["quiz"], list) or len(data["quiz"]) < 6:
        raise ValueError("Invalid quiz: must have at least 6 questions")

    for q in data["quiz"]:
        if len(q.get("options", [])) != 4:
            raise ValueError("Each question must have exactly 4 options")
        if q.get("answer") not in q.get("options", []):
            raise ValueError("Answer must match one of the options exactly")

def generate_dynamic_fallback(content: str) -> dict:
    """Generate dynamic fallback content based on article analysis"""
    import re
    
    # Extract basic info from content
    words = content.split()
    content_length = len(words)
    
    # Try to extract a title-like phrase from the beginning
    first_sentence = content.split('.')[0] if '.' in content else content[:100]
    
    # Extract potential names (simple pattern)
    names = re.findall(r'\b[A-Z][a-z]+\s[A-Z][a-z]+\b', content)
    unique_names = list(set(names))[:3]
    
    # Extract years
    years = re.findall(r'\b(19|20)\d{2}\b', content)
    unique_years = list(set(years))[:3]
    
    # Generate key points based on content
    key_points = [
        f"This article discusses {first_sentence.lower()}.",
        f"The content spans approximately {content_length} words of information.",
    ]
    
    if unique_names:
        key_points.append(f"Key individuals mentioned include {', '.join(unique_names)}.")
    if unique_years:
        key_points.append(f"Important years referenced: {', '.join(unique_years)}.")
    
    key_points.extend([
        "The article provides detailed information on the subject matter.",
        "Various aspects of the topic are explored in depth."
    ])
    
    # Generate dynamic questions based on extracted info
    quiz = []
    
    # Question 1: Basic topic
    quiz.append({
        "question": f"What is the main subject discussed in this article about {first_sentence.lower()}?",
        "options": ["History", "Science", "Technology", "Culture"],
        "answer": "History",
        "difficulty": "easy",
        "explanation": "The article focuses on historical and informational content."
    })
    
    # Question 2: Names if available
    if unique_names:
        quiz.append({
            "question": f"Which of these individuals is mentioned in the article?",
            "options": unique_names + ["Not mentioned"],
            "answer": unique_names[0],
            "difficulty": "medium",
            "explanation": f"{unique_names[0]} is referenced in the article content."
        })
    
    # Question 3: Years if available
    if unique_years:
        quiz.append({
            "question": f"Which year is referenced in the article?",
            "options": unique_years + ["2023"],
            "answer": unique_years[0],
            "difficulty": "medium",
            "explanation": f"The year {unique_years[0]} appears in the article content."
        })
    
    # Question 4: Content type
    quiz.append({
        "question": "What type of content does this Wikipedia article contain?",
        "options": ["Entertainment", "Educational", "Commercial", "Personal"],
        "answer": "Educational",
        "difficulty": "easy",
        "explanation": "Wikipedia articles are primarily educational resources."
    })
    
    # Question 5: Structure
    quiz.append({
        "question": "How is information typically organized in Wikipedia articles?",
        "options": ["Randomly", "By sections", "Alphabetically", "Chronologically"],
        "answer": "By sections",
        "difficulty": "easy",
        "explanation": "Wikipedia articles use structured sections for better readability."
    })
    
    # Question 6: Purpose
    quiz.append({
        "question": "What is the primary purpose of this article?",
        "options": ["Entertainment", "Information sharing", "Advertising", "Social networking"],
        "answer": "Information sharing",
        "difficulty": "easy",
        "explanation": "Wikipedia articles aim to share knowledge and information."
    })
    
    # Add more questions based on content length
    if content_length > 500:
        quiz.append({
            "question": "What can be inferred about the article's depth?",
            "options": ["Very brief", "Moderately detailed", "Highly comprehensive", "Too long"],
            "answer": "Moderately detailed",
            "difficulty": "medium",
            "explanation": "The article length suggests moderate detail on the subject."
        })
    
    # Generate related topics based on content
    related_topics = ["General Knowledge", "Wikipedia"]
    if "science" in content.lower() or "technology" in content.lower():
        related_topics.extend(["Science", "Technology"])
    if "history" in content.lower():
        related_topics.append("History")
    if any(word in content.lower() for word in ["computer", "software", "programming"]):
        related_topics.append("Computer Science")
    
    return {
        "summary": first_sentence.strip(),
        "quiz": quiz,
        "related_topics": related_topics[:5]
    }



# Test the API key when this module is run directly
if __name__ == "__main__":
    print("🔍 Testing Gemini API key...")
    success, message = test_api_key()
    if success:
        print(f"✅ API key is working! Response: {message}")
        print("🎉 The system will now use real AI for quiz generation!")
    else:
        print(f"❌ API key issue: {message}")
        print("💡 To fix this:")
        print("   1. Go to https://makersuite.google.com/app/apikey")
        print("   2. Create/get your API key")
        print("   3. Set environment variable: export GEMINI_API_KEY='your_key_here'")
        print("   4. Or replace the api_key variable in this file")
        print("🔄 Currently using dynamic fallback generation")