from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from tripnest.core.dependencies import get_current_user, get_db
from tripnest.models.user import User
from tripnest.models.trip import Trip
from tripnest.models.message import Message
from tripnest.models.promotion_request import PromotionRequest

# Crear un enrutador para las rutas relacionadas con los usuarios
router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    """
    Obtiene la información del usuario actual.

    Args:
        current_user (User): Usuario autenticado actual.

    Returns:
        dict: Información del usuario actual.
    """
    return {
        "id":        current_user.id,
        "email":     current_user.email,
        "full_name": current_user.full_name,
        "role":      current_user.role,
        "bio":       current_user.bio,
    }


@router.put("/me")
def update_me(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Actualiza la información del usuario actual.

    Args:
        payload (dict): Datos a actualizar.
        db (Session): Sesión de base de datos.
        current_user (User): Usuario autenticado actual.

    Returns:
        dict: Información actualizada del usuario.

    Raises:
        HTTPException: Si el nombre completo no está presente.
    """
    full_name = (payload.get("full_name") or "").strip()
    if not full_name:
        raise HTTPException(status_code=400, detail="El nom és obligatori")
    current_user.full_name = full_name
    current_user.bio = (payload.get("bio") or "").strip()[:255]
    db.commit()
    db.refresh(current_user)
    return {
        "id":        current_user.id,
        "email":     current_user.email,
        "full_name": current_user.full_name,
        "role":      current_user.role,
        "bio":       current_user.bio,
    }


@router.get("/me/stats")
def get_my_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Obtiene estadísticas del usuario actual.

    Args:
        db (Session): Sesión de base de datos.
        current_user (User): Usuario autenticado actual.

    Returns:
        dict: Estadísticas del usuario actual.
    """
    trips_joined = len(current_user.trips_joined)

    trips_created = db.query(func.count(Trip.id)).filter(
        Trip.creator_id == current_user.id
    ).scalar() or 0

    messages_sent = db.query(func.count(Message.id)).filter(
        Message.user_id == current_user.id
    ).scalar() or 0

    days_travelled = 0
    for trip in current_user.trips_joined:
        if trip.status == "Completat" and trip.start_date and trip.end_date:
            try:
                s = date.fromisoformat(str(trip.start_date))
                e = date.fromisoformat(str(trip.end_date))
                days_travelled += max(0, (e - s).days)
            except Exception:
                pass

    return {
        "trips_joined":   trips_joined,
        "trips_created":  trips_created,
        "messages_sent":  messages_sent,
        "days_travelled": days_travelled,
    }


@router.post("/promote-request")
def promote_request(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Crea una solicitud para promover al usuario a creador.

    Args:
        payload (dict): Contenido del mensaje de solicitud.
        db (Session): Sesión de base de datos.
        current_user (User): Usuario autenticado actual.

    Returns:
        dict: Información de la solicitud creada.

    Raises:
        HTTPException: Si el usuario ya es creador o tiene una solicitud pendiente.
    """
    if current_user.role == "creador":
        raise HTTPException(status_code=400, detail="Ja ets creador")

    existing = db.query(PromotionRequest).filter(
        PromotionRequest.user_id == current_user.id,
        PromotionRequest.status == "pending",
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ja tens una petició pending")

    msg = (payload.get("msg_content") or "").strip()
    if not msg:
        raise HTTPException(status_code=400, detail="El missatge és obligatori")

    req = PromotionRequest(user_id=current_user.id, msg_content=msg)
    db.add(req); db.commit(); db.refresh(req)
    return {"id": req.id, "status": req.status}