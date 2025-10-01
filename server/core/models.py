# models.py
from pydantic import BaseModel, EmailStr
from typing import List, Optional

class User(BaseModel):
    fullName: str
    email: EmailStr
    password: str  # ⚠️ hash this later, don’t store plain text
    attributes: dict
    resume: Optional[str] = None
    profilePhoto: Optional[str] = None