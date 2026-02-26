from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from tripnest.core.dependencies import get_db, get_current_user
from tripnest.models.user import User
from tripnest.models.promotion_request import PromotionRequest
from tripnest.schemas.user import UserOut, UserRoleUpdate
from tripnest.schemas.promotion import PromotionResponse, PromotionStatusUpdate

router = APIRouter(prefix="/admin", tags=["Admin"])


def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# ── GET /admin/users ──
@router.get("/users", response_model=List[UserOut])
def list_users(
        db: Session = Depends(get_db),
        admin: User = Depends(require_admin)
):
    return db.query(User).all()


# ── PUT /admin/users/{id}/role ──
@router.put("/users/{user_id}/role", response_model=UserOut)
def update_user_role(
        user_id: int,
        role_data: UserRoleUpdate,
        db: Session = Depends(get_db),
        admin: User = Depends(require_admin)
):
    if role_data.role not in ("viatger", "creador", "admin"):
        raise HTTPException(status_code=400, detail="Invalid role")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = role_data.role
    db.commit()
    db.refresh(user)
    return user


# ── GET /admin/promotions ──
@router.get("/promotions", response_model=List[PromotionResponse])
def list_promotions(
        db: Session = Depends(get_db),
        admin: User = Depends(require_admin)
):
    return db.query(PromotionRequest).all()


# ── PUT /admin/promotions/{id} ──
@router.put("/promotions/{promo_id}", response_model=PromotionResponse)
def decide_promotion(
        promo_id: int,
        decision: PromotionStatusUpdate,
        db: Session = Depends(get_db),
        admin: User = Depends(require_admin)
):
    if decision.status not in ("approved", "rejected"):
        raise HTTPException(status_code=400, detail="Status must be 'approved' or 'rejected'")

    promo = db.query(PromotionRequest).filter(PromotionRequest.id == promo_id).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promotion request not found")

    promo.status = decision.status

    # Si s'aprova, canvia el rol de l'usuari a creador
    if decision.status == "approved":
        user = db.query(User).filter(User.id == promo.user_id).first()
        if user:
            user.role = "creador"

    db.commit()
    db.refresh(promo)
    return promo