from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from tripnest.database import Base

class Message(Base):
    __tablename__ = "messages"

    id        = Column(Integer, primary_key=True, index=True)
    content   = Column(String(2000), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    user_id   = Column(Integer, ForeignKey("users.id"), nullable=False)
    trip_id   = Column(Integer, ForeignKey("trips.id"), nullable=False)

    user = relationship("User", back_populates="messages")
    trip = relationship("Trip", back_populates="messages")