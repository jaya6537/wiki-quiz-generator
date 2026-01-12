#!/usr/bin/env python3
import uvicorn
from app.main import app
from app.llm import test_api_key

if __name__ == "__main__":
    print("🔑 Testing Gemini API key on startup...")
    success, result = test_api_key()
    if success:
        print(f"✅ API key is working! Response: {result}")
    else:
        print(f"❌ API key failed: {result}")
        print("⚠️  Please set a valid GEMINI_API_KEY environment variable")
    
    uvicorn.run(app, host="0.0.0.0", port=8001)