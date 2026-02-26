from pydantic import BaseModel
from typing import Optional


class TripBase(BaseModel):
    title: str
    destination: str
    price: float
    description: Optional[str] = None


class TripCreate(TripBase):
    pass


class TripResponse(TripBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True
