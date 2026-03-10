import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'

// Pages
import Home          from '../pages/Home'
import Login         from '../pages/Login'
import Register      from '../pages/Register'
import Dashboard     from '../pages/Dashboard'
import TripDetail    from '../pages/TripDetail'
import TripCreate    from '../pages/TripCreate'
import TripEdit      from '../pages/TripEdit'
import Profile       from '../pages/Profile'
import PromotionForm from '../pages/PromotionForm'
import AdminUsers    from '../pages/admin/AdminUsers'
import AdminRequests from '../pages/admin/AdminRequests'
import NotFound from '../pages/NotFound'

/**
 * AppRoutes
 *
 * Componente que declara las rutas de la aplicación usando React Router (v6).
 *
 * Descripción general:
 * - Define rutas públicas (no requieren autenticación).
 * - Envuelve rutas protegidas con el componente `ProtectedRoute` para comprobar
 *   si el usuario está autenticado y, opcionalmente, si tiene un rol permitido.
 * - Redirige cualquier ruta desconocida a la raíz ("/").
 *
 * Contrato y notas sobre `ProtectedRoute` (convención usada aquí):
 * - children: ReactNode que se renderiza cuando la comprobación pasa.
 * - roles?: string[] (opcional) — lista de roles permitidos. Si se omite, se permite
 *   cualquier usuario que esté autenticado.
 * - Ejemplo: <ProtectedRoute roles={["admin", "creador"]}>...</ProtectedRoute>
 *
 * Recomendaciones:
 * - Mantener el listado de roles en una única fuente de verdad si se reutiliza en varios archivos.
 * - Si se necesita acceso público pero con datos limitados, considerar una ruta pública que
 *   muestre una vista con funcionalidades reducidas en vez de forzar autenticación.
 *
 * No recibe props.
 */
export default function AppRoutes() {
    return (
        <Routes>
            {/* ── RUTAS PÚBLICAS ──
                - Accesibles sin autenticación.
                - Normalmente: home, login, registro. */}
            <Route path="/"         element={<Home />} /> {/* Página principal (home) */}
            <Route path="/login"    element={<Login />} /> {/* Página de inicio de sesión */}
            <Route path="/register" element={<Register />} /> {/* Página de registro */}

            {/* ── RUTAS PROTEGIDAS: cualquier usuario autenticado ──
                - Se envuelven en <ProtectedRoute> sin prop `roles`.
                - Usadas para vistas que requieren inicio de sesión, independientemente del rol. */}
            <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
            } /> {/* Panel / Dashboard para usuarios autenticados */}
            <Route path="/trips/:id" element={
                <ProtectedRoute><TripDetail /></ProtectedRoute>
            } /> {/* Detalle de viaje. ':id' es un parámetro de ruta. */}
            <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
            } /> {/* Perfil de usuario */}

            {/* ── RUTAS PROTEGIDAS: rol 'viatger' (viajero) ──
                - Ejemplo de control por rol: solo usuarios con role "viatger" pueden acceder. */}
            <Route path="/promotion" element={
                <ProtectedRoute roles={["viatger"]}>
                    <PromotionForm />
                </ProtectedRoute>
            } /> {/* Formulario de promoción (solo viajeros) */}

            {/* ── RUTAS PROTEGIDAS: roles 'creador' y 'admin' ──
                - Rutas para creación y edición de viajes.
                - Acceso permitido a creadores y administradores. */}
            <Route path="/trips/create" element={
                <ProtectedRoute roles={["creador", "admin"]}>
                    <TripCreate />
                </ProtectedRoute>
            } /> {/* Crear viaje (creador + admin) */}
            <Route path="/trips/:id/edit" element={
                <ProtectedRoute roles={["creador", "admin"]}>
                    <TripEdit />
                </ProtectedRoute>
            } /> {/* Editar viaje (creador + admin); ':id' identifica el viaje */}

            {/* ── RUTAS PROTEGIDAS: rol 'admin' ──
                - Vistas de administración (gestión de usuarios y solicitudes). */}
            <Route path="/admin/users" element={
                <ProtectedRoute roles={["admin"]}>
                    <AdminUsers />
                </ProtectedRoute>
            } /> {/* Gestión de usuarios (solo admin) */}
            <Route path="/admin/requests" element={
                <ProtectedRoute roles={["admin"]}>
                    <AdminRequests />
                </ProtectedRoute>
            } /> {/* Gestión de solicitudes/promociones (solo admin) */}

            {/* ── REDIRECCIÓN 404 ──
                - Cualquier ruta no definida redirige a "/" (home) usando replace para no dejar
                - entradas en el historial del navegador. */}
            <Route path="*" element={<Navigate to="/" replace />} /> {/* Fallback: redirige a la home */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}