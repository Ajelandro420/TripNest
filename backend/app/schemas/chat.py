from pydantic import BaseModel
from datetime import datetime


class ChatBase(BaseModel):
    message: str


class ChatCreate(ChatBase):
    trip_id: int


class ChatResponse(ChatBase):
    id: int
    user_id: int
    trip_id: int
    created_at: datetime

    class Config:
        from_attributes = True
