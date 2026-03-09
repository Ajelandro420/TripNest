from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Carga las variables de entorno desde un archivo .env
load_dotenv()

# Obtiene la URL de la base de datos desde las variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL")

# Crea una instancia del motor de la base de datos
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Habilita el registro de todas las consultas SQL ejecutadas
    connect_args={"check_same_thread": False}  # IMPORTANTE para SQLite
)

# Crea una fábrica de sesiones para interactuar con la base de datos
SessionLocal = sessionmaker(bind=engine)

# Clase base para declarar modelos de SQLAlchemy
Base = declarative_base()
