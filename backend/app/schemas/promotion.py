from pydantic import BaseModel
from typing import Optional
from app.schemas.user import UserOut

class PromotionCreate(BaseModel):
    msg_content: str

class PromotionResponse(BaseModel):
    id:          int
    user_id:     int
    msg_content: str
    status:      str
    user:        Optional[UserOut] = None
    model_config = {"from_attributes": True}

class PromotionStatusUpdate(BaseModel):
    status: str