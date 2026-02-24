import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
    const { user, token, logout } = useAuth()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/')
        setMenuOpen(false)
    }

    return (
        <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="navigation" aria-label="Navegació principal">
            {/* Waves decoratives */}
            <div className="navbar__wave" aria-hidden="true" />

            <Link to="/" className="navbar__brand" aria-label="TripNest - Inici">
                <span className="navbar__logo-icon">🪺</span>
                <span className="navbar__logo-text">
          Trip<span className="navbar__logo-accent">Nest</span>
        </span>
            </Link>

            {/* Desktop links */}
            <div className="navbar__links" role="menubar">
                {!token ? (
                    <>
                        <Link to="/" className="navbar__link" role="menuitem">Inici</Link>
                        <Link to="/login" className="navbar__link" role="menuitem">Entrar</Link>
                        <Link to="/register" className="navbar__btn navbar__btn--primary" role="menuitem">
                            Registrar-se
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard" className="navbar__link" role="menuitem">Viatges</Link>
                        <Link to="/profile" className="navbar__link" role="menuitem">Perfil</Link>

                        {user?.rol === 'viatger' && (
                            <Link to="/promotion" className="navbar__link navbar__link--badge" role="menuitem">
                                Promoció
                                <span className="navbar__badge" aria-label="Nova funcionalitat">nou</span>
                            </Link>
                        )}

                        {user?.rol === 'creador' && (
                            <Link to="/trips/create" className="navbar__btn navbar__btn--creator" role="menuitem">
                                + Crear Viatge
                            </Link>
                        )}

                        {user?.rol === 'admin' && (
                            <div className="navbar__dropdown" role="menuitem">
                                <button className="navbar__link navbar__dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                                    ⚙️ Admin <span className="navbar__chevron">▾</span>
                                </button>
                                <div className="navbar__dropdown-menu" role="menu">
                                    <Link to="/admin/users" className="navbar__dropdown-item" role="menuitem">👥 Usuaris</Link>
                                    <Link to="/admin/requests" className="navbar__dropdown-item" role="menuitem">📋 Peticions</Link>
                                </div>
                            </div>
                        )}

                        <div className="navbar__user-chip">
              <span className="navbar__user-avatar" aria-hidden="true">
                {user?.full_name?.charAt(0).toUpperCase()}
              </span>
                            <span className="navbar__user-name">{user?.full_name?.split(' ')[0]}</span>
                        </div>

                        <button onClick={handleLogout} className="navbar__btn navbar__btn--logout" aria-label="Tancar sessió">
                            Sortir
                        </button>
                    </>
                )}
            </div>

            {/* Hamburger mobile */}
            <button
                className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-controls="mobile-menu"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Tancar menú' : 'Obrir menú'}
            >
                <span /><span /><span />
            </button>

            {/* Mobile menu */}
            <div
                id="mobile-menu"
                className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}
                role="dialog"
                aria-label="Menú mòbil"
            >
                <div className="navbar__mobile-inner">
                    {!token ? (
                        <>
                            <Link to="/" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>🏠 Inici</Link>
                            <Link to="/login" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>🔑 Entrar</Link>
                            <Link to="/register" className="navbar__mobile-link navbar__mobile-link--cta" onClick={() => setMenuOpen(false)}>✨ Registrar-se</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>🗺️ Viatges</Link>
                            <Link to="/profile" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>👤 Perfil</Link>
                            {user?.rol === 'viatger' && <Link to="/promotion" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>⬆️ Promoció</Link>}
                            {user?.rol === 'creador' && <Link to="/trips/create" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>➕ Crear Viatge</Link>}
                            {user?.rol === 'admin' && <>
                                <Link to="/admin/users" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>👥 Usuaris</Link>
                                <Link to="/admin/requests" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>📋 Peticions</Link>
                            </>}
                            <button onClick={handleLogout} className="navbar__mobile-link navbar__mobile-link--logout">🚪 Sortir</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}