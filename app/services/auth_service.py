import base64
import hashlib
import hmac
import json
import os
import time
from datetime import datetime
from typing import Any, Dict

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from models import User

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ACCESS_TOKEN_EXPIRE_SECONDS = int(os.getenv("ACCESS_TOKEN_EXPIRE_SECONDS", "3600"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def _sign_payload(payload_bytes: bytes) -> str:
    signature = hmac.new(SECRET_KEY.encode("utf-8"), payload_bytes, hashlib.sha256).digest()
    return base64.urlsafe_b64encode(signature).decode().rstrip("=")


def _encode_token(data: Dict[str, Any]) -> str:
    payload = data.copy()
    payload_bytes = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    signature = _sign_payload(payload_bytes)
    payload_b64 = base64.urlsafe_b64encode(payload_bytes).decode().rstrip("=")
    return f"{payload_b64}.{signature}"


def _decode_token(token: str) -> Dict[str, Any]:
    try:
        payload_b64, signature = token.split(".")
        padded_payload = payload_b64 + "=" * ((4 - len(payload_b64) % 4) % 4)
        payload_bytes = base64.urlsafe_b64decode(padded_payload)
        expected_signature = _sign_payload(payload_bytes)
        if not hmac.compare_digest(expected_signature, signature):
            raise ValueError("Invalid token signature")

        payload = json.loads(payload_bytes.decode("utf-8"))
        if int(payload.get("exp", 0)) < int(time.time()):
            raise ValueError("Token expired")

        return payload
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()

    def create_user(self, email: str, password: str, full_name: str | None = None) -> User:
        hashed_password = _hash_password(password)
        user = User(email=email, hashed_password=hashed_password, full_name=full_name)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def authenticate_user(self, email: str, password: str) -> User | None:
        user = self.get_user_by_email(email)
        if not user:
            return None
        return user if user.hashed_password == _hash_password(password) else None

    def create_access_token(self, data: Dict[str, Any]) -> str:
        payload = {
            **data,
            "exp": int(time.time()) + ACCESS_TOKEN_EXPIRE_SECONDS,
            "iat": int(time.time()),
        }
        return _encode_token(payload)
    
    def find_or_create_oauth_user(self, email: str, full_name: str, oauth_provider: str, oauth_id: str) -> User:
        user = self.get_user_by_email(email)
        if user:
            if not user.oauth_id:
                user.oauth_provider = oauth_provider
                user.oauth_id = oauth_id
                self.db.commit()
                self.db.refresh(user)
            return user
        user = User(
            email=email,
            full_name=full_name,
            oauth_provider=oauth_provider,
            oauth_id=oauth_id,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    @staticmethod
    async def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db),
    ) -> User:
        payload = _decode_token(token)
        email = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user


__all__ = ["AuthService", "oauth2_scheme"]
