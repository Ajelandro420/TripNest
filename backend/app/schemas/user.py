from pydantic import BaseModel, EmailStr


class UserUpdate(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
