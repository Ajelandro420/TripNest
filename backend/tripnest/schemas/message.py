from pydantic import BaseModel
from datetime import datetime

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    trip_id: int

class MessageOut(MessageBase):
    id: int
    created_at: datetime
    user_id: int
    trip_id: int

    class Config:
        orm_mode = True
