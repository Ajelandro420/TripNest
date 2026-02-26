import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
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
        <div className="tn-auth-page">
            <div className="tn-auth-card">

                {/* Header */}
                <div className="tn-auth-card__header" aria-hidden="true">
                    <span className="tn-auth-card__icon">🪺</span>
                </div>

                {/* Body */}
                <div className="tn-auth-card__body">
                    <h1 className="tn-auth-card__title">Benvingut de nou</h1>
                    <p className="tn-auth-card__subtitle">
                        Inicia sessió per accedir als teus viatges
                    </p>

                    {/* Error — role="alert" WCAG 4.1.3 */}
                    {error && (
                        <div
                            className="tn-auth-alert tn-auth-alert--error"
                            role="alert"
                            aria-live="assertive"
                        >
                            ⚠️ {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        aria-label="Formulari d'inici de sessió"
                    >
                        <div className="tn-auth-form-group">
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

                        <div className="tn-auth-form-group">
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
                            className="tn-auth-submit"
                            disabled={loading}
                            aria-busy={loading}
                        >
                            {loading ? '⏳ Entrant...' : '🔑 Iniciar sessió'}
                        </button>
                    </form>

                    <div className="tn-auth-divider"><span>o</span></div>

                    <p className="tn-auth-card__footer-text">
                        No tens compte?{' '}
                        <Link to="/register" className="tn-auth-card__link">
                            Registra't gratis
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}