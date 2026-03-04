from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tripnest.database import engine, Base
from tripnest.models import User, Trip, Message, PromotionRequest
from tripnest.routers import auth, users, trips, admin, chat

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TripNest API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(trips.router)
app.include_router(admin.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {"message": "TripNest API operativa"}
