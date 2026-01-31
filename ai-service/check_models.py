from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
try:
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    print("--- Selected Model Limits ---")
    target_models = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-1.5-flash"]
    count = 0
    
    for m in client.models.list(config={"page_size": 100}):
        name = m.name.replace("models/", "")
        
        # Check if this model is one of our targets (or close match)
        if name in target_models or any(t in name for t in target_models):
            print(f"Model: {name}")
            try:
                print(f"  In Limit: {m.input_token_limit}")
                print(f"  Out Limit: {m.output_token_limit}")
            except:
                print("  Limits not available")
            print("-" * 20)
            count += 1
    print(f"--- Total: {count} relevant models found ---")
except Exception as e:
    print(f"Error: {e}")
