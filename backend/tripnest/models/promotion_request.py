from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from tripnest.database import Base

class PromotionRequest(Base):
    __tablename__ = "promotion_requests"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    msg_content = Column(String(2000), nullable=False)
    status      = Column(String(20), default="pending")

    user = relationship("User", back_populates="promotions")