from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from tripnest.core.dependencies import get_db, get_current_user
from tripnest.models.user import User
from tripnest.models.promotion_request import PromotionRequest
from tripnest.schemas.user import UserOut, UserRoleUpdate
from tripnest.schemas.promotion import PromotionResponse, PromotionStatusUpdate

# Crear un enrutador para las rutas relacionadas con la administración
router = APIRouter(prefix="/admin", tags=["Admin"])

def require_admin(current_user: User = Depends(get_current_user)):
    """
    Verifica que el usuario actual tenga el rol de administrador.

    Args:
        current_user (User): Usuario autenticado actual.

    Returns:
        User: El usuario autenticado si tiene permisos de administrador.

    Raises:
        HTTPException: Si el usuario no tiene permisos de administrador.
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/users", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    """
    Lista todos los usuarios registrados en la base de datos.

    Args:
        db (Session): Sesión de base de datos.
        admin (User): Usuario autenticado con permisos de administrador.

    Returns:
        List[UserOut]: Lista de usuarios.
    """
    return db.query(User).all()

@router.put("/users/{user_id}/role", response_model=UserOut)
def update_role(user_id: int, role_data: UserRoleUpdate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    """
    Actualiza el rol de un usuario específico.

    Args:
        user_id (int): ID del usuario a actualizar.
        role_data (UserRoleUpdate): Nuevo rol para el usuario.
        db (Session): Sesión de base de datos.
        admin (User): Usuario autenticado con permisos de administrador.

    Returns:
        UserOut: Información del usuario actualizado.

    Raises:
        HTTPException: Si el usuario no se encuentra en la base de datos.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role_data.role
    db.commit()
    db.refresh(user)
    return user

@router.get("/promotions", response_model=List[PromotionResponse])
def list_promotions(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    """
    Lista todas las solicitudes de promoción pendientes.

    Args:
        db (Session): Sesión de base de datos.
        admin (User): Usuario autenticado con permisos de administrador.

    Returns:
        List[PromotionResponse]: Lista de solicitudes de promoción.
    """
    return db.query(PromotionRequest).all()

@router.put("/promotions/{promo_id}", response_model=PromotionResponse)
def decide_promotion(promo_id: int, decision: PromotionStatusUpdate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    """
    Decide el estado de una solicitud de promoción.

    Args:
        promo_id (int): ID de la solicitud de promoción.
        decision (PromotionStatusUpdate): Decisión sobre la solicitud (aprobada o rechazada).
        db (Session): Sesión de base de datos.
        admin (User): Usuario autenticado con permisos de administrador.

    Returns:
        PromotionResponse: Información de la solicitud de promoción actualizada.

    Raises:
        HTTPException: Si la solicitud de promoción no se encuentra en la base de datos.
    """
    promo = db.query(PromotionRequest).filter(PromotionRequest.id == promo_id).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Not found")
    promo.status = decision.status
    if decision.status == "approved":
        user = db.query(User).filter(User.id == promo.user_id).first()
        if user:
            user.role = "creador"
    db.commit()
    db.refresh(promo)
    return promo
