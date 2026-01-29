from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class PromotionRequest(Base):
    __tablename__ = "promotions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    msg_content = Column(String, nullable=False)
    status = Column(String, default="pending")
    # pending | approved | rejected

    user = relationship("User", back_populates="promotions")