// Registro: crea cuenta y valida campos basicos.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

function getStrength(pwd) {
    if (!pwd) return null
    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    if (score <= 1) return 'weak'
    if (score === 2) return 'fair'
    if (score === 3) return 'good'
    return 'strong'
}

const STRENGTH_LABELS = {
    weak: 'Feble',
    fair: 'Regular',
    good: 'Bona',
    strong: 'Forta',
}

const STRENGTH_META = {
    weak: { width: 'w-25', bg: 'bg-danger' },
    fair: { width: 'w-50', bg: 'bg-warning' },
    good: { width: 'w-75', bg: 'bg-info' },
    strong: { width: 'w-100', bg: 'bg-success' },
}

export default function Register() {
    const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '', terms: false })
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const strength = getStrength(form.password)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    const validate = () => {
        const e = {}
        if (!form.full_name.trim()) e.full_name = 'El nom es obligatori.'
        if (!form.email.trim()) e.email = 'El correu es obligatori.'
        if (form.password.length < 8) e.password = 'Minim 8 caracters.'
        if (form.password !== form.confirm) e.confirm = 'Les contrasenyes no coincideixen.'
        if (!form.terms) e.terms = "Has d'acceptar els termes."
        return e
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }
        setLoading(true)
        try {
            await api.post('/auth/register', {
                full_name: form.full_name,
                email: form.email,
                password: form.password,
            })
            setSuccess(true)
            setTimeout(() => navigate('/login'), 2800)
        } catch (err) {
            setErrors({ api: err.response?.data?.detail || 'Error en el registre. Prova amb un altre correu.' })
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <section className="py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            <div className="alert alert-success text-center mb-0" role="status">
                                <h2 className="h4 mb-2">Compte creat</h2>
                                <p className="mb-0">Redirigint al login...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-7">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4 p-md-5">
                                <h1 className="h3 mb-2 text-center">Crea el teu compte</h1>
                                <p className="text-secondary text-center mb-4">Uneix-te a la comunitat de viatgers</p>

                                {errors.api && (
                                    <div className="alert alert-danger" role="alert" aria-live="assertive">
                                        {errors.api}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} noValidate aria-label="Formulari de registre">
                                    <div className="mb-3">
                                        <label htmlFor="reg-name" className="form-label">Nom complet</label>
                                        <input
                                            id="reg-name"
                                            name="full_name"
                                            type="text"
                                            className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                                            value={form.full_name}
                                            onChange={handleChange}
                                            placeholder="Maria Garcia"
                                            required
                                            autoComplete="name"
                                        />
                                        {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="reg-email" className="form-label">Adreca de correu</label>
                                        <input
                                            id="reg-email"
                                            name="email"
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="nom@example.com"
                                            required
                                            autoComplete="email"
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="reg-password" className="form-label">Contrasenya</label>
                                        <input
                                            id="reg-password"
                                            name="password"
                                            type="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="Minim 8 caracters"
                                            required
                                            minLength={8}
                                            autoComplete="new-password"
                                        />
                                        {form.password && strength && (
                                            <>
                                                <div className="progress mt-2" role="progressbar" aria-label="Fortalesa contrasenya">
                                                    <div className={`progress-bar ${STRENGTH_META[strength].bg} ${STRENGTH_META[strength].width}`} />
                                                </div>
                                                <small className="text-secondary">Fortalesa: {STRENGTH_LABELS[strength]}</small>
                                            </>
                                        )}
                                        {!form.password && <small className="text-secondary">Usa lletres, numeros i simbols per a mes seguretat.</small>}
                                        {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="reg-confirm" className="form-label">Confirma la contrasenya</label>
                                        <input
                                            id="reg-confirm"
                                            name="confirm"
                                            type="password"
                                            className={`form-control ${errors.confirm ? 'is-invalid' : ''}`}
                                            value={form.confirm}
                                            onChange={handleChange}
                                            placeholder="Repeteix la contrasenya"
                                            required
                                            autoComplete="new-password"
                                        />
                                        {errors.confirm && <div className="invalid-feedback">{errors.confirm}</div>}
                                    </div>

                                    <div className="form-check mb-2">
                                        <input
                                            id="reg-terms"
                                            type="checkbox"
                                            name="terms"
                                            checked={form.terms}
                                            onChange={handleChange}
                                            className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                                        />
                                        <label className="form-check-label" htmlFor="reg-terms">
                                            Accepto els <a href="/terms" target="_blank" rel="noopener noreferrer">termes d'us</a> i la{' '}
                                            <a href="/privacy" target="_blank" rel="noopener noreferrer">politica de privacitat</a>
                                        </label>
                                        {errors.terms && <div className="invalid-feedback d-block">{errors.terms}</div>}
                                    </div>

                                    <button type="submit" className="btn btn-success w-100 mt-3" disabled={loading} aria-busy={loading}>
                                        {loading ? 'Creant compte...' : 'Crear compte gratis'}
                                    </button>
                                </form>

                                <p className="text-center mt-4 mb-0 text-secondary">
                                    Ja tens compte? <Link to="/login">Iniciar sessio</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}



