// Estructura general: proveedores globales, navbar/footer y rutas principales.
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import useAuth from './context/useAuth'
import { ToastProvider } from './components/Toast'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import AppRoutes from './routes/AppRoutes'

function AppSkeleton() {
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center gap-3 bg-light z-3">
            <div className="spinner-border text-info" role="status" aria-label="Carregant aplicacio" />
            <p className="h4 text-success fw-bold mb-0">
                Trip<span className="text-warning">Nest</span>
            </p>
            <p className="small text-secondary mb-0">Inicialitzant sessio...</p>
        </div>
    )
}

function AppInner() {
    const { loading } = useAuth()

    if (loading) return <AppSkeleton />

    return (
        <>
            <a href="#main-content" className="visually-hidden-focusable position-absolute top-0 start-0 m-2 p-2 bg-light border rounded">
                Saltar al contingut principal
            </a>
            <Navbar />
            <main id="main-content" className="pt-5 mt-3">
                <AppRoutes />
            </main>
            <Footer />
        </>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <ToastProvider>
                    <AppInner />
                </ToastProvider>
            </BrowserRouter>
        </AuthProvider>
    )
}

