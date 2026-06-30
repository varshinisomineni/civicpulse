from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.issues import router as issues_router
from routes.analytics import router as analytics_router
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="CivicPulse AI API",
    description="AI-powered hyperlocal community issue reporting platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        os.getenv("FRONTEND_URL", "http://localhost:3000")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(issues_router, prefix="/api/issues", tags=["Issues"])
app.include_router(analytics_router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/")
async def root():
    return {
        "name": "CivicPulse AI",
        "status": "running",
        "version": "1.0.0",
        "agents": ["vision", "priority", "routing", "duplicate_detection", "community_insights"]
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}