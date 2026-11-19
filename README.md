# TravelConnect

Aplicación web para organizar y unirse a viajes en grupo: los creadores publican viajes y los viajeros se apuntan y chatean con el resto del grupo en tiempo real.
Proyecto académico de DAW, con panel de administración y autenticación con JWT.

## Stack

| Capa | Tecnologías |
|------|-------------|
| Frontend | React 19, Vite, React Router, Bootstrap 5, Axios |
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Base de datos | SQLite (desarrollo) o MySQL (PyMySQL) |
| Autenticación | JWT (python-jose) + bcrypt (passlib) |
| Tiempo real | WebSockets (chat por viaje) |

## Funcionalidades

- Registro e inicio de sesión con JWT y contraseñas cifradas con bcrypt.
- Tres roles: **viajero**, **creador** y **administrador**.
- Crear, editar y borrar viajes (destino, fechas, descripción, plazas máximas).
- Apuntarse y salirse de un viaje, con control de plazas.
- Chat en tiempo real por viaje mediante WebSockets.
- Perfil de usuario con estadísticas personales.
- Solicitud para pasar de viajero a creador.
- Panel de administración: gestión de usuarios y roles, y aprobación de solicitudes.
- Estadísticas públicas en la página de inicio y página 404 personalizada.

## Capturas

<!-- Añade las imágenes en docs/screenshots/ y descomenta -->
<!--
![Inicio](docs/screenshots/home.png)
![Detalle de viaje con chat](docs/screenshots/trip-detail.png)
![Panel de administración](docs/screenshots/admin.png)
-->

## Cómo ejecutarlo

Necesitas Python 3.10+ y Node.js 18+.

### 1. Backend

```bash
cd backend
python -m venv venv
```

Activa el entorno virtual (`venv\Scripts\activate` en Windows, `source venv/bin/activate` en Linux/macOS) e instala las dependencias:

```bash
pip install -r requirements.txt
```

Crea tu archivo de variables de entorno a partir del ejemplo:

```bash
cp .env.example .env
```

Edita `backend/.env` con tus valores:

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | `sqlite:///./tripnest.db` o `mysql+pymysql://usuario:contraseña@localhost:3306/travelconnect` |
| `SECRET_KEY` | Clave para firmar los JWT. Genérala con `python -c "import secrets; print(secrets.token_hex(32))"` |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración del token, por ejemplo `60` |

Arranca el servidor:

```bash
python -m uvicorn tripnest.main:app --reload
```

La API queda en `http://localhost:8000` y la documentación interactiva en `http://localhost:8000/docs`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Pon tu clave de [Unsplash](https://unsplash.com/developers) en `VITE_UNSPLASH_KEY` dentro de `frontend/.env`. La aplicación se abre en `http://localhost:5173`.

## Estructura

```
backend/tripnest/   API (routers, models, schemas, core)
frontend/src/       React (pages, components, context, api)
```

## Autores

Proyecto realizado en pareja:

- **Alejandro Asensio Díaz** — [@Ajelandro420](https://github.com/Ajelandro420)
- **Ismail Kouira** — [@Tabascx](https://github.com/Tabascx)
