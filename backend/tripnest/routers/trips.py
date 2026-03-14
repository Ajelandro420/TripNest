from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from tripnest.core.dependencies import get_db, get_current_user
from tripnest.models.user import User
from tripnest.models.user import trip_participants
from tripnest.models.trip import Trip
from tripnest.schemas.trip import TripCreate, TripUpdate, TripResponse

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.get("/public-stats")
def get_public_stats(db: Session = Depends(get_db)):
    """Estadisticas publicas para la landing."""
    trips = db.query(Trip.destination).all()
    countries = set()

    for (destination,) in trips:
        if not destination:
            continue
        parts = [p.strip() for p in destination.split(",") if p.strip()]
        if parts:
            countries.add(parts[-1].lower())

    travelers_active = db.query(func.count(func.distinct(trip_participants.c.user_id))).scalar() or 0
    trips_created = db.query(func.count(Trip.id)).scalar() or 0

    return {
        "travelers_active": travelers_active,
        "trips_created": trips_created,
        "countries_visited": len(countries),
    }

@router.get("/", response_model=List[TripResponse])
def get_trips(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Obtener la lista de todos los viajes."""
    return db.query(Trip).all()

@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Obtener un viaje especifico por su ID.

    - **trip_id**: ID del viaje que se desea obtener.
    """
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.post("/", response_model=TripResponse, status_code=201)
def create_trip(trip_data: TripCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Crear un nuevo viaje.

    - **trip_data**: Datos del viaje a crear.
    """
    if current_user.role not in ("creador", "admin"):
        raise HTTPException(status_code=403, detail="Only creators can create trips")
    trip = Trip(**trip_data.model_dump(), creator_id=current_user.id)
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip

@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(trip_id: int, trip_data: TripUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Actualizar un viaje existente.

    - **trip_id**: ID del viaje a actualizar.
    - **trip_data**: Nuevos datos para el viaje.
    """
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.creator_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    for key, value in trip_data.model_dump(exclude_unset=True).items():
        setattr(trip, key, value)
    db.commit()
    db.refresh(trip)
    return trip

@router.delete("/{trip_id}", status_code=204)
def delete_trip(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Eliminar un viaje.

    - **trip_id**: ID del viaje a eliminar.
    """
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.creator_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    trip.participants.clear()
    db.delete(trip)
    db.commit()

@router.post("/{trip_id}/enroll")
def enroll(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Inscribir a un usuario en un viaje.

    - **trip_id**: ID del viaje en el que se desea inscribir al usuario.
    """
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

@router.post("/{trip_id}/leave")
def leave(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Retirar a un usuario de un viaje.

    - **trip_id**: ID del viaje del que se desea retirar al usuario.
    """
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if current_user not in trip.participants:
        raise HTTPException(status_code=400, detail="Not enrolled")
    trip.participants.remove(current_user)
    trip.user_count = max(0, trip.user_count - 1)
    db.commit()
    return {"detail": "Left successfully"}
