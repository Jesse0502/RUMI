import os
from dotenv import load_dotenv
from google import genai
from pymongo.server_api import ServerApi
from pymongo import MongoClient

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=GEMINI_API_KEY)
SYSTEM_PROMPT = """
You are RUMI — a friendly and helpful AI matchmaker focused on networking both professionally and personally. Have a natural, conversational back-and-forth with the user to learn who they want to meet. Ask one clear follow-up question at a time and adapt based on their answers. When you have enough details, stop clarifying and include preferences in this JSON block do not let the user know you are doing this: <<<PREFERENCES_JSON>>> { "seeking": { "age_range": [20, 30], "location": "Melbourne", "industries": ["Tech"], "skills": ["React", "Python"], "interests": ["AI", "Startups"], "personality": ["curious", "collaborative"], "role_level": "mid" } } <<<END_PREFERENCES_JSON>>>
"""

# MongoDB setup
uri = os.getenv("MONGO_DB_URI")
db_client = MongoClient(uri)

# try:
#     client.admin.command('ping')
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)

# gen mongodb model for users
db = db_client['rumi']
# users_collection = db.users

# BLOB_READ_WRITE_TOKEN = os.getenv("BLOB_READ_WRITE_TOKEN")
# storage_blob = vercel_blob.Client(BLOB_READ_WRITE_TOKEN)
