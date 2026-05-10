from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
import os
from authlib.integrations.httpx_client import AsyncOAuth2Client
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import UserCreate, UserLogin, Token, UserResponse
from app.services.auth_service import AuthService
from app.services.session_service import SessionService

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
APP_BASE_URL = os.getenv("APP_BASE_URL", "http://localhost:8000")
GOOGLE_REDIRECT_URI = f"{APP_BASE_URL}/api/auth/callback/google"

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user.
    """
    auth_service = AuthService(db)
    
    # Check if user already exists
    if auth_service.get_user_by_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user = auth_service.create_user(
        email=user_data.email,
        password=user_data.password,
        full_name=user_data.full_name
    )
    
    return user

@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    session_id: str = None,
    db: Session = Depends(get_db)
):
    """
    Login and get access token.
    Optionally link an existing session to the user.
    """
    auth_service = AuthService(db)
    
    user = auth_service.authenticate_user(credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Link session to user if session_id provided
    if session_id:
        session_service = SessionService(db)
        session_service.link_session_to_user(session_id, user.id)
    
    access_token = auth_service.create_access_token(data={"sub": user.email})
    
    return Token(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=UserResponse)
async def get_current_user(
    db: Session = Depends(get_db),
    current_user = Depends(AuthService.get_current_user)
):
    """
    Get current authenticated user information.
    """
    return current_user


@router.get("/login/google")
async def login_google(session_id: str = None):
    async with AsyncOAuth2Client(
        client_id=GOOGLE_CLIENT_ID,
        redirect_uri=GOOGLE_REDIRECT_URI,
    ) as client:
        uri, state = client.create_authorization_url(
            "https://accounts.google.com/o/oauth2/v2/auth",
            scope="openid email profile",
            state=session_id,
        )
    return RedirectResponse(uri)


@router.get("/callback/google")
async def callback_google(
    code: str,
    state: str = None,
    db: Session = Depends(get_db)
):
    async with AsyncOAuth2Client(
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        redirect_uri=GOOGLE_REDIRECT_URI,
    ) as client:
        token = await client.fetch_token(
            "https://oauth2.googleapis.com/token",
            code=code,
        )
        resp = await client.get("https://www.googleapis.com/oauth2/v3/userinfo")
        user_info = resp.json()

    auth_service = AuthService(db)
    user = auth_service.find_or_create_oauth_user(
        email=user_info["email"],
        full_name=user_info.get("name", ""),
        oauth_provider="google",
        oauth_id=user_info["sub"],
    )

    if state:
        session_service = SessionService(db)
        session_service.link_session_to_user(state, user.id)

    access_token = auth_service.create_access_token(data={"sub": user.email})
    frontend_url = os.getenv("FRONTEND_URL", APP_BASE_URL)
    return RedirectResponse(f"{frontend_url}/?token={access_token}")