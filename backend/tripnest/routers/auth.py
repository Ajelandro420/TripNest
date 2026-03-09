from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from tripnest.core.security import get_password_hash, verify_password, create_access_token
from tripnest.schemas.user import Token
from tripnest.database import SessionLocal
from tripnest.models.user import User
from tripnest.schemas.user import UserCreate, UserOut, Token

# Crear un enrutador para las rutas relacionadas con la autenticación
router = APIRouter(
    prefix="/auth",  # Prefijo para todas las rutas de este enrutador
    tags=["Auth"]  # Etiqueta para la documentación de la API
)

# Dependencia para obtener una sesión de base de datos
# Esta función se utiliza para gestionar la conexión a la base de datos
# y garantizar que se cierre correctamente después de cada solicitud.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Ruta para registrar un nuevo usuario
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """
    Registra un nuevo usuario en la base de datos.

    Args:
        user (UserCreate): Datos del usuario a registrar.
        db (Session): Sesión de base de datos proporcionada por la dependencia.

    Returns:
        UserOut: Información del usuario registrado.

    Raises:
        HTTPException: Si el correo electrónico ya está registrado.
    """
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        email=user.email,
        hashed_password=get_password_hash(user.password),
        full_name=user.full_name
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

# Ruta para iniciar sesión y obtener un token de acceso
@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Autentica a un usuario y genera un token de acceso.

    Args:
        form_data (OAuth2PasswordRequestForm): Datos de inicio de sesión (usuario y contraseña).
        db (Session): Sesión de base de datos proporcionada por la dependencia.

    Returns:
        dict: Token de acceso y tipo de token.

    Raises:
        HTTPException: Si el correo electrónico o la contraseña son incorrectos.
    """
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    access_token = create_access_token(data={"sub": str(user.id)})

    return {"access_token": access_token, "token_type": "bearer"}
