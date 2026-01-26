# python
from fastapi import FastAPI
from app.models.user import User
from app.models import User, Trip, Promotion, Chat
Base.metadata.create_all(bind=engine)



app = FastAPI(title="Tripnest API")

@app.get("/")
def root():
    return {"status": "Tripnest backend running"}
