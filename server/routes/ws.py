from fastapi import APIRouter, WebSocket
from core.config import gemini_client, SYSTEM_PROMPT
from core.utils import extract_json
import json
from google.genai import types

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    conversation_history = []

    try:
        while True:
            data = await websocket.receive_text()
            conversation_history.append(data)

            ai_response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=conversation_history,
                config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT)
            )

            extracted_text = extract_json(ai_response.text)
            payload = {"reply": extracted_text[1], "matches": []}

            if extracted_text[0]:
                payload["preferences"] = extracted_text[0]
                payload["matches"] = [{"id": 1, "name": "Alex"}]  # dummy

            await websocket.send_text(json.dumps(payload))
    except Exception as e:
        print(f"WebSocket error: {e}")
