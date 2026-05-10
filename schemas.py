from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# Chat Schemas
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    question_count: int
    requires_login: bool
    message: Optional[str] = None

class MessageSchema(BaseModel):
    role: str
    content: str
    timestamp: datetime
    
    class Config:
        from_attributes = True

# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    oauth_provider: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class SessionInfo(BaseModel):
    session_id: str
    question_count: int
    is_authenticated: bool
    messages: List[MessageSchema]