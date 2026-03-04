from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from tripnest.schemas.user import UserOut

class TripCreate(BaseModel):
    title: str
    destination: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    max_user_count: int = 10

class TripUpdate(BaseModel):
    title: Optional[str] = None
    destination: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    max_user_count: Optional[int] = None
    status: Optional[str] = None

class TripResponse(BaseModel):
    id: int
    title: str
    destination: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    status: str
    max_user_count: int
    user_count: int
    creator_id: int
    participants: List[UserOut] = []
    model_config = {"from_attributes": True}
