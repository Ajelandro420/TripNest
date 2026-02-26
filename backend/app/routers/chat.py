from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
import json
from datetime import datetime

from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.trip import Trip
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageOut
from app.core.config import SECRET_KEY, ALGORITHM
from jose import jwt, JWTError

router = APIRouter(tags=["Chat"])

# ── Gestor de connexions WebSocket actives ──
class ConnectionManager:
    def __init__(self):
        # { trip_id: [websocket, ...] }
        self.active: dict[int, list[WebSocket]] = {}

    async def connect(self, trip_id: int, ws: WebSocket):
        await ws.accept()
        self.active.setdefault(trip_id, []).append(ws)

    def disconnect(self, trip_id: int, ws: WebSocket):
        if trip_id in self.active:
            self.active[trip_id].discard(ws) if hasattr(self.active[trip_id], 'discard') \
                else (self.active[trip_id].remove(ws) if ws in self.active[trip_id] else None)

    async def broadcast(self, trip_id: int, message: dict):
        for ws in list(self.active.get(trip_id, [])):
            try:
                await ws.send_text(json.dumps(message, default=str))
            except Exception:
                pass


manager = ConnectionManager()


# ── GET /trips/{id}/messages — historial de missatges (REST) ──
@router.get("/trips/{trip_id}/messages", response_model=List[MessageOut])
def get_messages(
        trip_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    messages = (
        db.query(Message)
        .filter(Message.trip_id == trip_id)
        .order_by(Message.timestamp)
        .all()
    )

    result = []
    for m in messages:
        result.append(MessageOut(
            id=m.id,
            content=m.content,
            timestamp=m.timestamp,
            user_id=m.user_id,
            trip_id=m.trip_id,
            user_name=m.user.full_name if m.user else None
        ))
    return result


# ── WebSocket /ws/trips/{id}/chat?token=... ──
@router.websocket("/ws/trips/{trip_id}/chat")
async def websocket_chat(
        trip_id: int,
        ws: WebSocket,
        token: str,
        db: Session = Depends(get_db)
):
    # Autenticació per token a query param
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            await ws.close(code=1008)
            return
    except JWTError:
        await ws.close(code=1008)
        return

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        await ws.close(code=1008)
        return

    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        await ws.close(code=1011)
        return

    await manager.connect(trip_id, ws)

    try:
        while True:
            data = await ws.receive_text()
            payload_msg = json.loads(data)
            content = payload_msg.get("content", "").strip()

            if not content:
                continue

            # Guardar missatge a BD
            msg = Message(
                content=content,
                user_id=user.id,
                trip_id=trip_id,
                timestamp=datetime.utcnow()
            )
            db.add(msg)
            db.commit()
            db.refresh(msg)

            # Emetre a tots els clients del viatge
            await manager.broadcast(trip_id, {
                "id":        msg.id,
                "content":   msg.content,
                "timestamp": msg.timestamp.isoformat(),
                "user_id":   msg.user_id,
                "trip_id":   msg.trip_id,
                "user_name": user.full_name,
            })

    except WebSocketDisconnect:
        manager.disconnect(trip_id, ws)