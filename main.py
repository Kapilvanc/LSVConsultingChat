from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

# Serve static files (your frontend)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return FileResponse("static/index.html")

@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "Chat API is running"}

# Your chat endpoint (we'll build this later)
@app.post("/api/chat")
async def chat(message: dict):
    return {"response": "Echo: " + message.get("text", "")}