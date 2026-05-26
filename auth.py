from fastapi import APIRouter, Depends, HTTPException
import os
import jwt
from jwt import PyJWKClient
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import UserResponse
from app.services.auth_service import AuthService
from app.services.session_service import SessionService

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN", "")
AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID", "")

class Auth0CallbackRequest(BaseModel):
    id_token: str
    session_id: str = None

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    db: Session = Depends(get_db),
    current_user = Depends(AuthService.get_current_user)
):
    return current_user


@router.post("/auth0/callback")
async def auth0_callback(
    payload: Auth0CallbackRequest,
    db: Session = Depends(get_db)
):
    try:
        jwks_client = PyJWKClient(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json")
        signing_key = jwks_client.get_signing_key_from_jwt(payload.id_token)
        claims = jwt.decode(
            payload.id_token,
            signing_key.key,
            algorithms=["RS256"],
            audience=AUTH0_CLIENT_ID,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Auth0 token: {str(e)}")

    email = claims.get("email")
    full_name = claims.get("name", "")
    sub = claims.get("sub", "")

    if not email:
        raise HTTPException(status_code=400, detail="No email in Auth0 token")

    auth_service = AuthService(db)
    user = auth_service.find_or_create_oauth_user(
        email=email,
        full_name=full_name,
        oauth_provider="auth0",
        oauth_id=sub,
    )

    if payload.session_id:
        session_service = SessionService(db)
        session_service.link_session_to_user(payload.session_id, user.id)

    access_token = auth_service.create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"email": user.email, "full_name": user.full_name}
    }