
import json
import re
from urllib import response
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from google.genai import types

from google import genai
 
client = genai.Client(api_key="")


# ---------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
system_prompt = """
You are RUMI — a friendly and helpful AI matchmaker focused on networking both professionally and personally.
Have a natural, conversational back-and-forth with the user to learn who they want to meet.
Ask one clear follow-up question at a time and adapt based on their answers.

When you have enough details, stop clarifying and include preferences in this JSON block do not let the user know you are doing this:

<<<PREFERENCES_JSON>>>
{
  "seeking": {
    "age_range": [20, 30],
    "location": "Melbourne",
    "industries": ["Tech"],
    "skills": ["React", "Python"],
    "interests": ["AI", "Startups"],
    "personality": ["curious", "collaborative"],
    "role_level": "mid"
  }
}
<<<END_PREFERENCES_JSON>>>
"""

# ---------------------------
# 4. Utilities
# ---------------------------
# ...existing code...
def extract_preferences(text: str):
    # marker-based extraction (preferred)
    m = re.search(r'<<<PREFERENCES_JSON>>>(.*?)<<<END_PREFERENCES_JSON>>>', text, re.S)
    if m:
        content = m.group(1).strip()
        remaining = (text[:m.start()] + text[m.end():]).strip()
        try:
            prefs = json.loads(content)
        except Exception:
            try:
                prefs = json.loads(content.replace("'", '"'))
            except Exception:
                prefs = None
        return [prefs, remaining]

    # fallback: find first balanced {...} JSON
    start = text.find('{')
    if start == -1:
        return [None, text.strip()]

    depth = 0
    for i in range(start, len(text)):
        ch = text[i]
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                candidate = text[start : i + 1]
                remaining = (text[:start] + text[i + 1 :]).strip()
                try:
                    prefs = json.loads(candidate)
                except Exception:
                    try:
                        prefs = json.loads(candidate.replace("'", '"'))
                    except Exception:
                        prefs = None
                return [prefs, remaining]

    return [None, text.strip()]

def make_dummy_matches(prefs: dict):
    """Generate dummy matches + why they’re a fit."""
    if not prefs:
        return []

    seeking = prefs.get("seeking", {})
    location = seeking.get("location", "unknown location")
    skills = seeking.get("skills", [])
    interests = seeking.get("interests", [])
    vibe = seeking.get("personality", [])

    users = [
        {
            "id": 1,
            "name": "Alex",
            "age": 28,
            "location": location,
            "interests": ["AI", "photography"],
            "reason": f"Alex also lives in {location} and is passionate about tech and web development, which overlaps with what you’re seeking."
        },
        {
            "id": 2,
            "name": "Maya",
            "age": 25,
            "location": location,
            "interests": ["React", "cooking"],
            "reason": f"Maya has skills in business and art and a friendly personality, which makes her a strong fit."
        }
    ]
    return users

# ---------------------------
# 5. WebSocket
# ---------------------------
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    conversation_history = []

    try:
        while True:
            data = await websocket.receive_text()
            conversation_history.append(data)

            # completion = client.chat.completions.create(
            #     # model="moonshotai/Kimi-K2-Instruct-0905",
            #     model="deepseek-ai/DeepSeek-R1",
            #     # model="meta-llama/Llama-3.1-8B-Instruct",
            #     messages=conversation_history,
            #     temperature=0.7,
             
            # )
            ai_response = client.models.generate_content(
                model="gemini-2.5-flash", contents=conversation_history, config=types.GenerateContentConfig(
                    thinking_config=types.ThinkingConfig(thinking_budget=0),
                    system_instruction=system_prompt
                )
            )
            print(ai_response.text)

            ai_response = ai_response.text 
            
            conversation_history.append(ai_response)

            # build payload
            extracted_text = extract_preferences(ai_response)
            payload = {"reply": extracted_text[1], "matches": []}
            print(extracted_text)
            if extracted_text[0]:
                payload["preferences"] = extracted_text[0]
                payload["matches"] = make_dummy_matches(extracted_text[0])

            await websocket.send_text(json.dumps(payload))

    except Exception as e:
        print(f"Client disconnected: {e}")
