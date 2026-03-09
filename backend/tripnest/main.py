from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tripnest.database import engine, Base
from tripnest.models import User, Trip, Message, PromotionRequest
from tripnest.routers import auth, users, trips, admin, chat

# Crea todas las tablas de base de datos definidas en los modelos
Base.metadata.create_all(bind=engine)

# Inicializa la aplicacion de FastAPI
app = FastAPI(title="TripNest API", version="1.0.0")

# Agrega middleware para manejar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],  # Origenes permitidos para el frontend
    allow_credentials=True,  # Permite cookies y cabeceras de autenticacion
    allow_methods=["*"],  # Permite todos los metodos HTTP
    allow_headers=["*"],  # Permite todas las cabeceras HTTP
)

# Incluye routers para los distintos endpoints de la API
app.include_router(auth.router)  # Rutas de autenticacion
app.include_router(users.router)  # Rutas de usuarios
app.include_router(trips.router)  # Rutas de viajes
app.include_router(admin.router)  # Rutas de administracion
app.include_router(chat.router)  # Rutas de chat

# Define el endpoint raiz
@app.get("/")
def root():
    """
    Endpoint raiz para verificar que la API esta operativa.

    Returns:
        dict: Mensaje que indica que la API esta en ejecucion.
    """
    return {"message": "TripNest API operativa"}
