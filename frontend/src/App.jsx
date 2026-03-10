import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import Navbar    from './components/Layout/Navbar'
import Footer    from './components/Layout/Footer'
import AppRoutes from './routes/AppRoutes'

/* ── Spinner mentre AuthContext verifica el token ── */
function AppSkeleton() {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            background: 'linear-gradient(135deg, #0D2B45 0%, #1A5276 50%, #17A589 100%)',
            zIndex: 9999,
        }}>
            <span style={{ fontSize: '2.8rem', animation: 'spin 1s linear infinite' }}>🪺</span>
            <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.6rem',
                fontWeight: 900,
                color: '#fff',
                margin: 0,
            }}>
                Trip<span style={{ color: '#48C9B0' }}>Nest</span>
            </p>
            <div style={{
                width: '160px',
                height: '3px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '2px',
                overflow: 'hidden',
            }}>
                <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #48C9B0, #E59866, #48C9B0)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.4s ease-in-out infinite',
                    borderRadius: '2px',
                }} />
            </div>
            <style>{`
                @keyframes spin {
                    0%   { transform: rotate(0deg) scale(1); }
                    50%  { transform: rotate(180deg) scale(1.1); }
                    100% { transform: rotate(360deg) scale(1); }
                }
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    )
}

/* ── Inner que espera que AuthContext estigui llest ── */
function AppInner() {
    const { loading } = useAuth()

    if (loading) return <AppSkeleton />

    return (
        <>
            <a href="#main-content" className="skip-to-content">
                Saltar al contingut principal
            </a>
            <Navbar />
            <main id="main-content">
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