import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
    const { user, token, logout } = useAuth()
    const navigate  = useNavigate()
    const location  = useLocation()
    const [menuOpen,   setMenuOpen]   = useState(false)
    const [scrolled,   setScrolled]   = useState(false)
    const [adminOpen,  setAdminOpen]  = useState(false)
    const [userOpen,   setUserOpen]   = useState(false)
    const userRef  = useRef(null)
    const adminRef = useRef(null)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => { setMenuOpen(false); setUserOpen(false); setAdminOpen(false) }, [location.pathname])

    // Tanca dropdowns en clicar fora
    useEffect(() => {
        const handler = (e) => {
            if (userRef.current  && !userRef.current.contains(e.target))  setUserOpen(false)
            if (adminRef.current && !adminRef.current.contains(e.target)) setAdminOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleLogout = () => { logout(); navigate('/') }
    const isActive = (path) => location.pathname === path
    const initials = user?.full_name?.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase() || '?'

    return (
        <nav className={`tn-navbar ${scrolled ? 'tn-navbar--scrolled' : ''}`} role="navigation" aria-label="Navegació principal">
            <div className="tn-navbar__wave" aria-hidden="true" />

            {/* BRAND */}
            <Link to="/" className="tn-navbar__brand" aria-label="TripNest — Inici">
                <span className="tn-navbar__logo-icon" aria-hidden="true">🪺</span>
                <span className="tn-navbar__logo-text">Trip<span className="tn-navbar__logo-accent">Nest</span></span>
            </Link>

            {/* LINKS ESCRIPTORI */}
            <div className="tn-navbar__links">
                {!token ? (
                    <>
                        <Link to="/"         className={`tn-navbar__link ${isActive('/') ? 'tn-navbar__link--active' : ''}`}>Inici</Link>
                        <Link to="/login"    className={`tn-navbar__link ${isActive('/login') ? 'tn-navbar__link--active' : ''}`}>Entrar</Link>
                        <Link to="/register" className="tn-navbar__btn tn-navbar__btn--primary">Registrar-se</Link>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard" className={`tn-navbar__link ${isActive('/dashboard') ? 'tn-navbar__link--active' : ''}`}>Viatges</Link>

                        {user?.role === 'viatger' && (
                            <Link to="/promotion" className={`tn-navbar__link ${isActive('/promotion') ? 'tn-navbar__link--active' : ''}`}>
                                Promoció <span className="tn-navbar__badge">nou</span>
                            </Link>
                        )}

                        {(user?.role === 'creador' || user?.role === 'admin') && (
                            <Link to="/trips/create" className="tn-navbar__btn tn-navbar__btn--creator">+ Crear Viatge</Link>
                        )}

                        {/* Admin dropdown */}
                        {user?.role === 'admin' && (
                            <div className="tn-navbar__dropdown" ref={adminRef}>
                                <button
                                    className={`tn-navbar__link tn-navbar__dropdown-toggle ${adminOpen ? 'tn-navbar__link--active' : ''}`}
                                    aria-haspopup="true" aria-expanded={adminOpen}
                                    onClick={() => setAdminOpen(!adminOpen)}
                                >
                                    ⚙️ Admin <span className="tn-navbar__chevron" aria-hidden="true">{adminOpen ? '▴' : '▾'}</span>
                                </button>
                                <div className={`tn-navbar__dropdown-menu ${adminOpen ? 'tn-navbar__dropdown-menu--open' : ''}`}>
                                    <Link to="/admin/users"    className="tn-navbar__dropdown-item" onClick={() => setAdminOpen(false)}>👥 Usuaris</Link>
                                    <Link to="/admin/requests" className="tn-navbar__dropdown-item" onClick={() => setAdminOpen(false)}>📋 Peticions</Link>
                                </div>
                            </div>
                        )}

                        {/* Avatar → dropdown perfil */}
                        <div className="tn-navbar__dropdown tn-navbar__user-dropdown" ref={userRef}>
                            <button
                                className={`tn-navbar__avatar-btn ${userOpen ? 'tn-navbar__avatar-btn--open' : ''}`}
                                onClick={() => setUserOpen(!userOpen)}
                                aria-haspopup="true"
                                aria-expanded={userOpen}
                                aria-label={`Menú de ${user?.full_name}`}
                            >
                                <span className="tn-navbar__avatar-initials">{initials}</span>
                                <span className="tn-navbar__avatar-name">{user?.full_name?.split(' ')[0]}</span>
                                <span className="tn-navbar__chevron" aria-hidden="true">{userOpen ? '▴' : '▾'}</span>
                            </button>

                            <div className={`tn-navbar__dropdown-menu tn-navbar__user-menu ${userOpen ? 'tn-navbar__dropdown-menu--open' : ''}`}>
                                {/* Capçalera del menú */}
                                <div className="tn-navbar__user-menu-header">
                                    <span className="tn-navbar__user-menu-avatar">{initials}</span>
                                    <div>
                                        <div className="tn-navbar__user-menu-name">{user?.full_name}</div>
                                        <div className="tn-navbar__user-menu-email">{user?.email}</div>
                                        <span className={`tn-navbar__role-chip tn-navbar__role-chip--${user?.role}`}>
                      { user?.role === 'admin' ? '⚙️ Admin' : user?.role === 'creador' ? '✈️ Creador' : '🧳 Viatger' }
                    </span>
                                    </div>
                                </div>
                                <div className="tn-navbar__dropdown-divider" />
                                <Link to="/profile" className="tn-navbar__dropdown-item" onClick={() => setUserOpen(false)}>
                                    👤 El meu perfil
                                </Link>
                                <div className="tn-navbar__dropdown-divider" />
                                <button onClick={() => { setUserOpen(false); handleLogout() }} className="tn-navbar__dropdown-item tn-navbar__dropdown-item--danger">
                                    🚪 Tancar sessió
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* HAMBURGER */}
            <button
                className={`tn-navbar__hamburger ${menuOpen ? 'tn-navbar__hamburger--open' : ''}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Tancar menú' : 'Obrir menú'}
            >
                <span aria-hidden="true"/><span aria-hidden="true"/><span aria-hidden="true"/>
            </button>

            {/* BACKDROP mòbil */}
            {menuOpen && <div className="tn-navbar__backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

            {/* MENÚ MÒBIL */}
            <div id="mobile-menu" className={`tn-navbar__mobile ${menuOpen ? 'tn-navbar__mobile--open' : ''}`} aria-modal="true">
                <div className="tn-navbar__mobile-inner">
                    {token && user && (
                        <div className="tn-navbar__mobile-user">
                            <span className="tn-navbar__mobile-avatar">{initials}</span>
                            <div>
                                <div className="tn-navbar__mobile-user-name">{user.full_name}</div>
                                <div className="tn-navbar__mobile-user-email">{user.email}</div>
                            </div>
                        </div>
                    )}
                    {!token ? (
                        <>
                            <Link to="/"         className="tn-navbar__mobile-link">🏠 Inici</Link>
                            <Link to="/login"    className="tn-navbar__mobile-link">🔑 Entrar</Link>
                            <Link to="/register" className="tn-navbar__mobile-link tn-navbar__mobile-link--cta">✨ Registrar-se</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" className="tn-navbar__mobile-link">🗺️ Viatges</Link>
                            <Link to="/profile"   className="tn-navbar__mobile-link">👤 El meu perfil</Link>
                            {user?.role === 'viatger'  && <Link to="/promotion"    className="tn-navbar__mobile-link">⬆️ Demanar Promoció</Link>}
                            {(user?.role === 'creador' || user?.role === 'admin') && <Link to="/trips/create" className="tn-navbar__mobile-link">➕ Crear Viatge</Link>}
                            {user?.role === 'admin' && <>
                                <Link to="/admin/users"    className="tn-navbar__mobile-link">👥 Gestió Usuaris</Link>
                                <Link to="/admin/requests" className="tn-navbar__mobile-link">📋 Peticions</Link>
                            </>}
                            <div className="tn-navbar__mobile-divider" />
                            <button onClick={handleLogout} className="tn-navbar__mobile-link tn-navbar__mobile-link--logout">🚪 Sortir</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}