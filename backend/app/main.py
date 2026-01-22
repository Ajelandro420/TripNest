from fastapi import FastAPI
from app.database import Base, engine
from models.user import User


app = FastAPI(title="Tripnest API")

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"status": "Tripnest backend running"}

