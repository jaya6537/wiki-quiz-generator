#!/usr/bin/env python3
import uvicorn
import os
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
    
    # Render provides PORT environment variable, default to 8001 for local dev
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)