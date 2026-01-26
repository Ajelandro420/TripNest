from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Promotion(Base):
    __tablename__ = "promotions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    discount_percent = Column(Float, nullable=False)

    trip_id = Column(Integer, ForeignKey("trips.id"))

    trip = relationship("Trip", back_populates="promotions")
