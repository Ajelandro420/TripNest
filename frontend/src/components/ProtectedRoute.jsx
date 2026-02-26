// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, roles }) {
    const { user, token } = useAuth()

    if (!token) return <Navigate to="/login" />
    if (roles && !roles.includes(user?.rol)) return <Navigate to="/dashboard" />

    return children
}
