from datetime import datetime
from sqlalchemy.orm import Session

from models import ChatSession, Message


class SessionService:
    def __init__(self, db: Session):
        self.db = db

    def get_session(self, session_id: str) -> ChatSession | None:
        return self.db.query(ChatSession).filter(ChatSession.session_id == session_id).first()

    def create_session(self, session_id: str) -> ChatSession:
        session = ChatSession(session_id=session_id)
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def increment_question_count(self, session_db_id: int) -> ChatSession | None:
        session = self.db.query(ChatSession).filter(ChatSession.id == session_db_id).first()
        if not session:
            return None
        session.question_count += 1
        session.last_activity = datetime.utcnow()
        self.db.commit()
        self.db.refresh(session)
        return session

    def add_message(self, session_db_id: int, role: str, content: str) -> Message:
        message = Message(session_id=session_db_id, role=role, content=content)
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
        return message

    def link_session_to_user(self, session_id: str, user_id: int) -> ChatSession | None:
        session = self.get_session(session_id)
        if not session:
            return None
        session.user_id = user_id
        session.is_authenticated = True
        self.db.commit()
        self.db.refresh(session)
        return session
