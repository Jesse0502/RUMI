from core.constants import SECRET_KEY, ALGORITHM
from fastapi import APIRouter, Depends, HTTPException, Request,Response, UploadFile, File, Form
import json, time
from jose import jwt, JWTError
from core.config import db
import datetime
from fastapi.responses import JSONResponse

from routes.general import create_access_token


def validate_token(request: Request, res: Response):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = auth_header.split(" ")[1]
    try:
        print(token, SECRET_KEY, ALGORITHM)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Optionally refresh token
        new_token = create_access_token({"user_id": user_id}
        )
        # return new token in headers
        res.headers["X-Refreshed-Token"] = new_token
 
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


router = APIRouter(prefix="/user",
    tags=["user"],
    dependencies=[Depends(validate_token)])

@router.get("/me")
async def get_profile(user: dict = Depends(validate_token)):
    print("Fetching user profile")
    userInfo = db['users'].find_one({"_id": user.get("user_id")})
    time.sleep(1)  # Simulate delay
    return {"message": "User profile data", "userInfo": userInfo}