from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import chat, auth
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

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