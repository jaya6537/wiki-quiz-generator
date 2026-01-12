#!/usr/bin/env python3

import requests
import json

# Test the API
url = "http://localhost:8001/generate-quiz"
data = {
    "url": "https://en.wikipedia.org/wiki/Python_(programming_language)"
}

print("🧪 Testing the updated backend API...")
try:
    response = requests.post(url, json=data)
    if response.status_code == 200:
        result = response.json()
        print("✅ API call successful!")
        print(f"📝 Title: {result['title']}")
        print(f"❓ Questions: {len(result['quiz'])}")
        print(f"📊 Related topics: {len(result['related_topics'])}")

        # Show first question as sample
        if result['quiz']:
            q = result['quiz'][0]
            print(f"\n📖 Sample Question: {q['question']}")
            print(f"🎯 Options: {q['options']}")
            print(f"✅ Answer: {q['answer']}")

    else:
        print(f"❌ API error: {response.status_code}")
        print(response.text)

except Exception as e:
    print(f"❌ Request failed: {e}")