from google.genai import types
from core.config import gemini_client
import json
import re
from typing import Any, Dict, Optional

# ...existing code...

def _extract_json_block(text: str) -> Optional[Dict[str, Any]]:
    """Prefer marker-delimited JSON, fall back to first balanced {...} block."""
    m = re.search(r'<<<PREFERENCES_JSON>>>(.*?)<<<END_PREFERENCES_JSON>>>', text, re.S)
    if m:
        content = m.group(1).strip()
    else:
        start = text.find('{')
        if start == -1:
            return None
        depth = 0
        end_idx = None
        for i in range(start, len(text)):
            ch = text[i]
            if ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    end_idx = i + 1
                    break
        if end_idx is None:
            return None
        content = text[start:end_idx]

    # Try strict JSON then a simple single-quote fallback
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        try:
            return json.loads(content.replace("'", '"'))
        except Exception:
            return None


def _normalize_preferences(raw: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    """Normalize parsed preferences into the desired object shape with safe defaults."""
    defaults = {
        "industries": [],
        "skills": [],
        "interests": [],
        "personality": [],
        "additional_attributes": [],
        "bio": ""
    }

    if not raw:
        return defaults

    # Some outputs may wrap the object under "seeking"
    data = raw.get("seeking", raw)

    out = defaults.copy()
    for key in out.keys():
        val = data.get(key)
        if val is None:
            continue

        # lists normalization
        if key in ("industries", "skills", "interests", "personality", "additional_attributes"):
            if isinstance(val, str):
                # try to parse JSON-array string, fallback to comma-split
                try:
                    parsed = json.loads(val)
                    out[key] = list(parsed) if isinstance(parsed, (list, tuple)) else [str(parsed)]
                except Exception:
                    out[key] = [s.strip() for s in val.split(",") if s.strip()]
            elif isinstance(val, (list, tuple)):
                out[key] = list(val)
            else:
                out[key] = [str(val)]
        else:
            # scalar fields
            out[key] = str(val) if not isinstance(val, (list, dict)) else val

    return out


def extract_profile_with_ai(text: str) -> Dict[str, Any]:
    """
    Use the AI client to extract a structured profile object from resume text.
    Returns an object shaped like:
    {
      "industries": [],
      "skills": [],
      "interests": [],
      "personality": [],
      "additional_attributes": [],
      "bio": ""
    }
    """
    prompt = f"""
You are a helpful resume parser. Extract the candidate's profile information from the resume text below.
Return ONLY a single JSON object between the exact markers <<<PREFERENCES_JSON>>> and <<<END_PREFERENCES_JSON>>>.

The JSON must follow this schema:

{{
  "industries": [],         // array of industry strings
  "skills": [],             // array of skill strings
  "interests": [],          // array of interest strings
  "personality": [],        // array of personality/vibe strings
  "additional_attributes": [], // any other general extracted attributes as strings
  "bio": ""                 // a short bio/summary string
}}

Resume text:
{text}
"""

    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction="You are a resume parser. Always return valid JSON between the markers."
        )
    )

    raw_text = getattr(response, "text", None) or str(response)
    # attempt to extract JSON block and normalize
    parsed = _extract_json_block(raw_text)
    normalized = _normalize_preferences(parsed)
    return normalized
# ...existing code...