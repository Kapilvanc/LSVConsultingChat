from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import ChatRequest, ChatResponse, SessionInfo
from app.services.chat_service import ChatService
from app.services.session_service import SessionService
import uuid

router = APIRouter()

@router.post("/message", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Send a message to the chatbot.
    Returns a response and session information.
    """
    # Get or create session
    session_service = SessionService(db)
    
    if request.session_id:
        session = session_service.get_session(request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        session_id = str(uuid.uuid4())
        session = session_service.create_session(session_id)
    
    # Check if user has exceeded free question limit
    if session.question_count >= 5 and not session.is_authenticated:
        return ChatResponse(
            # response="You've reached the limit of 5 free questions. Please log in to continue chatting!",
            response="",
            session_id=session.session_id,
            question_count=session.question_count,
            requires_login=True,
            message="Login required to continue"
        )
    
    if session.question_count >= 50 and session.is_authenticated:
        return ChatResponse(
            response="",
            session_id=session.session_id,
            question_count=session.question_count,
            requires_login=False,
            message="limit_reached"
        )
    
    # Process the chat message
    chat_service = ChatService(db)
    response_text = await chat_service.get_response(request.message, session)
    
    # Update session
    session_service.increment_question_count(session.id)
    session_service.add_message(session.id, "user", request.message)
    session_service.add_message(session.id, "assistant", response_text)
    
    # Refresh session to get updated count
    db.refresh(session)
    
    requires_login = session.question_count >= 5 and not session.is_authenticated
    
    return ChatResponse(
        response=response_text,
        session_id=session.session_id,
        question_count=session.question_count,
        requires_login=requires_login,
        message="4 questions remaining" if session.question_count == 1 and not session.is_authenticated else None
    )

@router.get("/session/{session_id}", response_model=SessionInfo)
async def get_session(
    session_id: str,
    db: Session = Depends(get_db)
):
    """
    Get session information and chat history.
    """
    session_service = SessionService(db)
    session = session_service.get_session(session_id)
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return SessionInfo(
        session_id=session.session_id,
        question_count=session.question_count,
        is_authenticated=session.is_authenticated,
        messages=session.messages
    )