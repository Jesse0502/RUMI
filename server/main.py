from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from routes import users, ws, general
from slowapi.middleware import SlowAPIMiddleware 
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Refreshed-Token", "Authorization"]
)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

limiter = Limiter(key_func=get_remote_address)

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)


@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"error": "Too many requests, try again later."},
    )
# include routes 
app.include_router(users.router)
app.include_router(ws.router)
app.include_router(general.router)