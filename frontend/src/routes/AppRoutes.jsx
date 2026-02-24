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

export default function AppRoutes() {
    return (
        <Routes>
            {/* ── PÚBLIQUES ── */}
            <Route path="/"         element={<Home />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ── PROTEGIDES: tots els rols ── */}
            <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/trips/:id" element={
                <ProtectedRoute><TripDetail /></ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
            } />

            {/* ── PROTEGIDES: Viatger ── */}
            <Route path="/promotion" element={
                <ProtectedRoute roles={["viatger"]}>
                    <PromotionForm />
                </ProtectedRoute>
            } />

            {/* ── PROTEGIDES: Creador + Admin ── */}
            <Route path="/trips/create" element={
                <ProtectedRoute roles={["creador", "admin"]}>
                    <TripCreate />
                </ProtectedRoute>
            } />
            <Route path="/trips/:id/edit" element={
                <ProtectedRoute roles={["creador", "admin"]}>
                    <TripEdit />
                </ProtectedRoute>
            } />

            {/* ── PROTEGIDES: Admin ── */}
            <Route path="/admin/users" element={
                <ProtectedRoute roles={["admin"]}>
                    <AdminUsers />
                </ProtectedRoute>
            } />
            <Route path="/admin/requests" element={
                <ProtectedRoute roles={["admin"]}>
                    <AdminRequests />
                </ProtectedRoute>
            } />

            {/* ── 404 ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}