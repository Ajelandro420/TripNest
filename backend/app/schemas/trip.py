from pydantic import BaseModel
from datetime import date


class TripBase(BaseModel):
    title: str
    description: str | None = None
    destination: str
    price: float
    start_date: date
    end_date: date


class TripCreate(TripBase):
    pass


class TripResponse(TripBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True
