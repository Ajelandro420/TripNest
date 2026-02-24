import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../public/context/AuthContext.jsx'
import api from '../api/axiosConfig'
import './Login.css'

export default function Login() {
    const [email,    setEmail]    = useState('')
    const [password, setPassword] = useState('')
    const [error,    setError]    = useState('')
    const [loading,  setLoading]  = useState(false)
    const { login } = useAuth()
    const navigate  = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            // FastAPI OAuth2 espera FormData (x-www-form-urlencoded)
            const form = new FormData()
            form.append('username', email)
            form.append('password', password)

            const { data } = await api.post('/auth/login', form)
            const token = data.access_token

            const me = await api.get('/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
            login(token, me.data)
            navigate('/dashboard')
        } catch {
            setError('Email o contrasenya incorrectes. Torna-ho a intentar.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="tn-auth-page page-enter">
            <div className="tn-auth-card">
                {/* Header decoratiu */}
                <div className="tn-auth-card__header" aria-hidden="true">
                    <span className="tn-auth-card__icon">🪺</span>
                </div>

                <div className="tn-auth-card__body">
                    <h1 className="tn-auth-card__title">Benvingut de nou</h1>
                    <p className="tn-auth-card__subtitle">Inicia sessió per accedir als teus viatges</p>

                    {error && (
                        <div className="tn-alert tn-alert--error" role="alert" aria-live="assertive">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate aria-label="Formulari d'inici de sessió">
                        <div className="tn-form-group">
                            <label htmlFor="login-email">Adreça de correu</label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="nom@example.com"
                                required
                                autoComplete="email"
                                aria-required="true"
                            />
                        </div>

                        <div className="tn-form-group">
                            <label htmlFor="login-password">Contrasenya</label>
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="La teva contrasenya"
                                required
                                autoComplete="current-password"
                                aria-required="true"
                            />
                        </div>

                        <button
                            type="submit"
                            className="tn-btn tn-btn--primary tn-btn--full"
                            disabled={loading}
                            aria-busy={loading}
                        >
                            {loading ? '⏳ Entrant...' : '🔑 Iniciar sessió'}
                        </button>
                    </form>

                    <p className="tn-auth-card__footer-text">
                        No tens compte?{' '}
                        <Link to="/register" className="tn-auth-card__link">
                            Registra't gratis
                        </Link>
                    </p>
                </div>
            </div>

            <style>{authStyles}</style>
        </div>
    )
}
