#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(__file__))

from app.llm import test_api_key

if __name__ == "__main__":
    print("🔑 Testing Gemini API key...")
    success, result = test_api_key()
    if success:
        print(f"✅ API key is working! Response: {result}")
    else:
        print(f"❌ API key failed: {result}")