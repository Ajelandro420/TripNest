from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    description = Column(String, nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    creator_id = Column(Integer, ForeignKey("users.id"))

    user_count = Column(Integer, default=0)
    max_user_count= Column(Integer, nullable=False)

    creator = relationship("User", back_populates="trips")
    messages = relationship("Message", back_populates="trip")