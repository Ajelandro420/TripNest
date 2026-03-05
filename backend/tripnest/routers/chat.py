from datetime import datetime
import json
from typing import List

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from tripnest.core.config import ALGORITHM, SECRET_KEY
from tripnest.core.dependencies import get_current_user, get_db
from tripnest.models.message import Message
from tripnest.models.trip import Trip
from tripnest.models.user import User

router = APIRouter(prefix="/trips", tags=["Chat"])


class ConnectionManager:
    def __init__(self):
        self.active: dict[int, list[WebSocket]] = {}

    async def connect(self, trip_id: int, ws: WebSocket):
        await ws.accept()
        self.active.setdefault(trip_id, []).append(ws)

    def disconnect(self, trip_id: int, ws: WebSocket):
        if trip_id in self.active and ws in self.active[trip_id]:
            self.active[trip_id].remove(ws)

    async def broadcast(self, trip_id: int, message: dict):
        for ws in list(self.active.get(trip_id, [])):
            try:
                await ws.send_text(json.dumps(message, default=str))
            except Exception:
                pass


manager = ConnectionManager()


def _can_access_trip_chat(trip: Trip, user: User) -> bool:
    is_participant = any(p.id == user.id for p in trip.participants)
    is_owner_or_admin = trip.creator_id == user.id or user.role == "admin"
    return is_participant or is_owner_or_admin


@router.get("/{trip_id}/chat")
def get_messages(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if not _can_access_trip_chat(trip, current_user):
        raise HTTPException(status_code=403, detail="No tens permis per accedir al xat")

    messages = db.query(Message).filter(Message.trip_id == trip_id).order_by(Message.timestamp).all()
    return [
        {
            "id": m.id,
            "contingut": m.content,
            "timestamp": m.timestamp,
            "autor": {
                "id": m.user_id,
                "full_name": m.user.full_name if m.user else "Usuari",
            },
        }
        for m in messages
    ]


@router.post("/{trip_id}/chat/send")
def send_message(
    trip_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if not _can_access_trip_chat(trip, current_user):
        raise HTTPException(status_code=403, detail="No tens permis per accedir al xat")

    text = (payload.get("contingut") or payload.get("content") or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="El missatge no pot estar buit")

    msg = Message(content=text, user_id=current_user.id, trip_id=trip_id, timestamp=datetime.utcnow())
    db.add(msg)
    db.commit()
    db.refresh(msg)

    return {
        "id": msg.id,
        "contingut": msg.content,
        "timestamp": msg.timestamp,
        "autor": {"id": current_user.id, "full_name": current_user.full_name},
    }


@router.websocket("/ws/trips/{trip_id}/chat")
async def websocket_chat(trip_id: int, ws: WebSocket, token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
    except JWTError:
        await ws.close(code=1008)
        return

    user = db.query(User).filter(User.id == user_id).first()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not user or not trip or not _can_access_trip_chat(trip, user):
        await ws.close(code=1008)
        return

    await manager.connect(trip_id, ws)

    try:
        while True:
            data = await ws.receive_text()
            parsed = json.loads(data)
            content = (parsed.get("contingut") or parsed.get("content") or "").strip()
            if not content:
                continue

            msg = Message(content=content, user_id=user.id, trip_id=trip_id, timestamp=datetime.utcnow())
            db.add(msg)
            db.commit()
            db.refresh(msg)

            await manager.broadcast(
                trip_id,
                {
                    "id": msg.id,
                    "contingut": msg.content,
                    "timestamp": msg.timestamp.isoformat(),
                    "autor": {"id": user.id, "full_name": user.full_name},
                },
            )
    except WebSocketDisconnect:
        manager.disconnect(trip_id, ws)
