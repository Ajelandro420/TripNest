from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageCreate(BaseModel):
    content: str
    trip_id: int

class MessageOut(BaseModel):
    id: int
    content: str
    timestamp: datetime
    user_id: int
    trip_id: int
    user_name: Optional[str] = None
    model_config = {"from_attributes": True}
