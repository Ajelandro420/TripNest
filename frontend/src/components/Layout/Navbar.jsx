// Barra superior: muestra opciones segun si hay usuario y su rol.
import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../context/useAuth'

export default function Navbar() {
    const { user, token, logout } = useAuth()
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const initials = user?.full_name?.split(' ').map((w) => w[0]).join('').substring(0, 2).toUpperCase() || '?'

    return (
        <nav className={`navbar navbar-expand-lg fixed-top navbar-dark shadow-sm ${scrolled ? 'bg-primary' : 'bg-primary'}`} aria-label="Navegacio principal">
            <div className="container py-1">
                <Link to="/" className="navbar-brand fw-bold d-inline-flex align-items-center gap-2" aria-label="TripNest inici">
                    <span aria-hidden="true">??</span>
                    <span>Trip<span className="text-info">Nest</span></span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#tnMainNav"
                    aria-controls="tnMainNav"
                    aria-expanded="false"
                    aria-label="Obrir menu"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="tnMainNav">
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                        {!token && (
                            <>
                                <li className="nav-item">
                                    <NavLink to="/" className="nav-link">Inici</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/login" className="nav-link">Entrar</NavLink>
                                </li>
                                <li className="nav-item mt-2 mt-lg-0">
                                    <Link to="/register" className="btn btn-warning fw-semibold">Registrar-se</Link>
                                </li>
                            </>
                        )}

                        {token && (
                            <>
                                <li className="nav-item">
                                    <NavLink to="/dashboard" className="nav-link">Viatges</NavLink>
                                </li>

                                {user?.role === 'viatger' && (
                                    <li className="nav-item">
                                        <NavLink to="/promotion" className="nav-link">
                                            Promocio <span className="badge rounded-pill text-bg-warning ms-1">nou</span>
                                        </NavLink>
                                    </li>
                                )}

                                {(user?.role === 'creador' || user?.role === 'admin') && (
                                    <li className="nav-item mt-2 mt-lg-0">
                                        <Link to="/trips/create" className="btn btn-success fw-semibold">+ Crear Viatge</Link>
                                    </li>
                                )}

                                {user?.role === 'admin' && (
                                    <li className="nav-item dropdown">
                                        <button
                                            className="nav-link dropdown-toggle border-0 bg-transparent text-white"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Administracio
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                                            <li><Link to="/admin/users" className="dropdown-item">Usuaris</Link></li>
                                            <li><Link to="/admin/requests" className="dropdown-item">Peticions</Link></li>
                                        </ul>
                                    </li>
                                )}

                                <li className="nav-item dropdown">
                                    <button
                                        className="btn btn-outline-light dropdown-toggle border-0"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        aria-label={`Menu de ${user?.full_name || 'usuari'}`}
                                    >
                                        <span className="badge rounded-pill text-dark bg-warning me-1">{initials}</span>
                                        <span className="d-none d-lg-inline">{user?.full_name?.split(' ')[0]}</span>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                                        <li className="dropdown-item-text small text-muted">{user?.email}</li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><Link to="/profile" className="dropdown-item">El meu perfil</Link></li>
                                        <li>
                                            <button type="button" className="dropdown-item text-danger" onClick={handleLogout}>
                                                Tancar sessio
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

