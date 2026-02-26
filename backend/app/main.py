from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base

# Importar tots els models perquè SQLAlchemy els registri
from app.models import User, Trip, Message, PromotionRequest

# Importar routers
from app.routers import auth, users, trips, admin, chat

# Crear taules a la BD
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TripNest API",
    description="Backend per a la plataforma de viatges en grup TripNest",
    version="1.0.0",
)

# ── CORS — permet el frontend de React ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(trips.router)
app.include_router(admin.router)
app.include_router(chat.router)


@app.get("/", tags=["Root"])
def root():
    return {"message": "TripNest API operativa 🪺", "docs": "/docs"}