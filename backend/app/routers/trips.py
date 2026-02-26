from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.trip import Trip
from app.schemas.trip import TripCreate, TripUpdate, TripResponse

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.get("/", response_model=List[TripResponse])
def get_trips(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Trip).all()

@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.post("/", response_model=TripResponse, status_code=201)
def create_trip(
        trip_data: TripCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    if current_user.role not in ("creador", "admin"):
        raise HTTPException(status_code=403, detail="Only creators can create trips")
    trip = Trip(**trip_data.model_dump(), creator_id=current_user.id)
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip

@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(
        trip_id: int,
        trip_data: TripUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.creator_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    update_data = trip_data.model_dump(exclude_unset=True)
    if "max_user_count" in update_data and update_data["max_user_count"] < trip.user_count:
        raise HTTPException(status_code=400, detail=f"Cannot reduce below current participants ({trip.user_count})")
    for key, value in update_data.items():
        setattr(trip, key, value)
    db.commit()
    db.refresh(trip)
    return trip

@router.delete("/{trip_id}", status_code=204)
def delete_trip(
        trip_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.creator_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    trip.participants.clear()
    db.delete(trip)
    db.commit()

@router.post("/{trip_id}/enroll", status_code=200)
def enroll(
        trip_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if current_user in trip.participants:
        raise HTTPException(status_code=400, detail="Already enrolled")
    if trip.user_count >= trip.max_user_count:
        raise HTTPException(status_code=400, detail="Trip is full")
    trip.participants.append(current_user)
    trip.user_count += 1
    db.commit()
    return {"detail": "Enrolled successfully"}

@router.post("/{trip_id}/leave", status_code=200)
def leave(
        trip_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if current_user not in trip.participants:
        raise HTTPException(status_code=400, detail="Not enrolled")
    trip.participants.remove(current_user)
    trip.user_count = max(0, trip.user_count - 1)
    db.commit()
    return {"detail": "Left trip successfully"}