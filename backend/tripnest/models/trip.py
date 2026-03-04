from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from tripnest.database import Base
from tripnest.models.user import trip_participants

class Trip(Base):
    __tablename__ = "trips"
    id             = Column(Integer, primary_key=True, index=True)
    title          = Column(String(200), nullable=False)
    destination    = Column(String(200), nullable=False)
    description    = Column(String(2000), nullable=True)
    start_date     = Column(Date, nullable=False)
    end_date       = Column(Date, nullable=False)
    status         = Column(String(20), default="Planificant")
    max_user_count = Column(Integer, nullable=False, default=10)
    user_count     = Column(Integer, default=0)
    creator_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    creator      = relationship("User", back_populates="trips_created")
    participants = relationship("User", secondary=trip_participants, back_populates="trips_joined")
    messages     = relationship("Message", back_populates="trip", cascade="all, delete-orphan")
