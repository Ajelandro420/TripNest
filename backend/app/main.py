# python
from fastapi import FastAPI
from app.models.user import User

app = FastAPI(title="Tripnest API")

@app.get("/")
def root():
    return {"status": "Tripnest backend running"}
