// Login: valida formulario, pide token y redirige.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../context/useAuth'
import api from '../api/axiosConfig'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

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
                headers: { Authorization: `Bearer ${token}` },
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
        <section className="py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4 p-md-5">
                                <h1 className="h3 mb-2 text-center">Benvingut de nou</h1>
                                <p className="text-secondary text-center mb-4">Inicia sessio per accedir als teus viatges</p>

                                {error && (
                                    <div className="alert alert-danger" role="alert" aria-live="assertive">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} noValidate aria-label="Formulari d'inici de sessio">
                                    <div className="mb-3">
                                        <label htmlFor="login-email" className="form-label">Adreca de correu</label>
                                        <input
                                            id="login-email"
                                            type="email"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="nom@example.com"
                                            required
                                            autoComplete="email"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="login-password" className="form-label">Contrasenya</label>
                                        <input
                                            id="login-password"
                                            type="password"
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="La teva contrasenya"
                                            required
                                            autoComplete="current-password"
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100" disabled={loading} aria-busy={loading}>
                                        {loading ? 'Entrant...' : 'Iniciar sessio'}
                                    </button>
                                </form>

                                <p className="text-center mt-4 mb-0 text-secondary">
                                    No tens compte? <Link to="/register">Registra't gratis</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}



