from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import chat, auth
from app.database import engine, Base
from sqlalchemy import text

# Create database tables

def run_migrations():
    if "sqlite" in str(engine.url):
        return
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_id VARCHAR"))
        conn.execute(text("ALTER TABLE users ALTER COLUMN hashed_password DROP NOT NULL"))
        conn.commit()

Base.metadata.create_all(bind=engine)
run_migrations()


app = FastAPI(
    title="Mr. Penumarthi's Chatbot",
    description="AI-powered chatbot for Q&A",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

# @app.get("/")
# async def root():
#     return {
#         "message": "Portfolio Chatbot API",
#         "status": "active",
#         "docs": "/docs"
#     }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.mount("/", StaticFiles(directory="static", html=True), name="static")