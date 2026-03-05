import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roles }) {
    const { user, token, loading } = useAuth()

    // Espera que AuthContext acabi de verificar el token
    if (loading) return null

    // Sense token → login
    if (!token) return <Navigate to="/login" replace />

    // Amb roles definits → comprova el rol (user.role, no user.rol)
    if (roles && user && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}