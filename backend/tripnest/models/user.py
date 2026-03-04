from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from tripnest.database import Base

trip_participants = Table(
    "trip_participants",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("trip_id", Integer, ForeignKey("trips.id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"
    id              = Column(Integer, primary_key=True, index=True)
    email           = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name       = Column(String(100), nullable=False)
    role            = Column(String(20), default="viatger")
    bio             = Column(String(255), nullable=True)
    trips_created = relationship("Trip", back_populates="creator")
    trips_joined  = relationship("Trip", secondary=trip_participants, back_populates="participants")
    messages      = relationship("Message", back_populates="user")
    promotions    = relationship("PromotionRequest", back_populates="user")
