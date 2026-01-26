from pydantic import BaseModel


class PromotionBase(BaseModel):
    title: str
    discount_percent: float


class PromotionCreate(PromotionBase):
    trip_id: int


class PromotionResponse(PromotionBase):
    id: int
    trip_id: int

    class Config:
        from_attributes = True
