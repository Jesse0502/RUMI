import datetime
import uuid
from fastapi import APIRouter, HTTPException, UploadFile, File, Request, Response, Form
import jwt
from slowapi.util import get_remote_address
from slowapi.extension import Limiter
from core.utils import extract_text_from_pdf, is_valid_email
from core.constants import TOKEN_EXPIRE_DAYS
from services.ai_service import extract_profile_with_ai
from core.constants import SECRET_KEY, ALGORITHM
import json
import time
from passlib.context import CryptContext
from core.config import db
# from core.config import db

router = APIRouter(prefix="/gen", tags=["General"])
limiter = Limiter(key_func=get_remote_address)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: datetime.timedelta = None):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (expires_delta or datetime.timedelta(days=TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
@router.post("/extract-skills")
@limiter.limit("10/min")   # allow 10 req/min per IP
async def extract_profile(request: Request, resume: UploadFile = File(...), res: Response = None):
    try:
        client_host = request.client.host

        # bypass limiter for localhost
        if client_host in ("127.0.0.1", "localhost"):
            limiter.reset()  # clear counters for local
            pass

        content = await resume.read()
        text = (
            extract_text_from_pdf(content)
            if resume.filename.endswith(".pdf")
            else content.decode("utf-8", "ignore")
        )

        raw = extract_profile_with_ai(text)
        msg = "Attributes extracted successfully" if raw else "No profile data found"

        try: 
            if type(raw) == str:
                raw = json.loads(raw).get('skills', [])

        except Exception as e: 
            cleaned = {}  
            if type(raw) == str:
                cleaned = raw.strip().strip("").replace("json", "").replace("```", "")
                raw = cleaned
            msg = "Attributes extracted with some issues"

        res.status_code = 200
        return {"attributes": raw, "msg": msg}
    except Exception as e:
        print(e)
        res.status_code = 500
        return {"attributes": {}, "msg": "Server error"}
    # users_collection = db.users
@router.post("/check-email")
async def check_email(data: dict, res: Response = None):
    try:
        email = data.get("email")
        # check if email exists in db
        
        if not email or email.strip() == "":
            res.status_code = 400
            return {"msg": "Email is required"}

        if not is_valid_email(email):
            res.status_code = 400
            return {"msg": "Invalid email format", "status": 400}
        
        existing_user = db['users'].find_one({"email": email})
        
        if existing_user:
            res.status_code = 400
            return {"msg": "Email already exists"}
        # users_collection = db.users
        # existing_user = users_collection.find_one({"email": email})
        # if existing_user:
        #     return {"msg": "Email already exists"}, 400
        res.status_code = 200
        return {"msg": "Email is available", "status": 200}
    except Exception as e:
        print(e)
        res.status_code = 500
        return {"msg": "Server error"}

@router.post("/create-user")
async def onboarding(
    fullName: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    attributes: str = Form(...),
    resume: UploadFile = File(None),
    photo: UploadFile = File(None),
    res: Response = None,
    req: Request = None
):
    try: 
        # profile_data = json.loads(profile_data)
        resume_path, photo_path = "", ""

        # gen unique id
        user_id = str(uuid.uuid4())

        if db["users"].find_one({"email": email}):
            res.status_code = 400
            return {"msg": "Email already exists", "status": 400}
        base_url = str(req.base_url).rstrip("/")

        if resume:
            resume_path = f"uploads/{user_id}_{resume.filename}"
            with open(resume_path, "wb") as f:
                f.write(await resume.read())
                resume_path = f"{base_url}/{resume_path}"

        if photo:
            # get current address and append it to the photo path
            photo_path = f"uploads/{user_id}_{photo.filename}"
            with open(photo_path, "wb") as f:
                f.write(await photo.read())
                photo_path = f"{base_url}/{photo_path}"
        

        user_doc = {
            "_id": user_id,
            "fullName": fullName,
            "email": email,
            "password": hash_password(password),  # ⚠️ Hash later with bcrypt
            "attributes": json.loads(attributes),
            "resume_url": resume_path,
        "photo_url": photo_path,
        "created_at": time.time()
    }
        # Save user to database and return the data except password
        
        db["users"].insert_one(user_doc)
      
        res.status_code = 201
        return {
                "token": create_access_token({"user_id": user_id}),
            "saved": user_doc,
            "status": 201
        }
    except Exception as e:
        print(e)
        res.status_code = 500
        return {"msg": "Server error", "status": 500}


@router.post("/login")
async def login(res: Response = None, data: dict = None):
    print("inside login", data)
    email = data.get("email")
    password = data.get("password")
    user = db['users'].find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    new_token = create_access_token({"user_id": user["_id"]})
    user.pop("password", None)  # remove password before sending user data

    print(user)
    return {"user": user, "status": 200, "token": new_token}
