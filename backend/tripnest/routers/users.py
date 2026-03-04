from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from tripnest.core.dependencies import get_db, get_current_user
from tripnest.models.user import User
from tripnest.models.promotion_request import PromotionRequest
from tripnest.schemas.user import UserOut, UserUpdate
from tripnest.schemas.promotion import PromotionCreate, PromotionResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserOut)
def update_me(user_data: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if user_data.full_name is not None:
        current_user.full_name = user_data.full_name
    if user_data.bio is not None:
        current_user.bio = user_data.bio
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/promote-request", response_model=PromotionResponse, status_code=201)
def request_promotion(promo_data: PromotionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "viatger":
        raise HTTPException(status_code=400, detail="Only viatgers can request promotion")
    existing = db.query(PromotionRequest).filter(PromotionRequest.user_id == current_user.id, PromotionRequest.status == "pending").first()
    if existing:
        raise HTTPException(status_code=400, detail="You already have a pending request")
    promo = PromotionRequest(user_id=current_user.id, msg_content=promo_data.msg_content)
    db.add(promo)
    db.commit()
    db.refresh(promo)
    return promo
