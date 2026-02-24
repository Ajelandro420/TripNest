import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import './Register.css'

function getStrength(pwd) {
    if (!pwd) return null
    let score = 0
    if (pwd.length >= 8)  score++
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
    weak: '🔴 Feble', fair: '🟠 Regular', good: '🟡 Bona', strong: '🟢 Forta',
}

export default function Register() {
    const [form,    setForm]    = useState({ full_name:'', email:'', password:'', confirm:'', terms:false })
    const [errors,  setErrors]  = useState({})
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const strength = getStrength(form.password)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const validate = () => {
        const e = {}
        if (!form.full_name.trim())          e.full_name = 'El nom és obligatori.'
        if (!form.email.trim())              e.email     = 'El correu és obligatori.'
        if (form.password.length < 8)        e.password  = 'Mínim 8 caràcters.'
        if (form.password !== form.confirm)  e.confirm   = 'Les contrasenyes no coincideixen.'
        if (!form.terms)                     e.terms     = "Has d'acceptar els termes."
        return e
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length > 0) { setErrors(errs); return }
        setLoading(true)
        try {
            await api.post('/auth/register', { full_name: form.full_name, email: form.email, password: form.password })
            setSuccess(true)
            setTimeout(() => navigate('/login'), 2800)
        } catch (err) {
            setErrors({ api: err.response?.data?.detail || 'Error en el registre. Prova amb un altre correu.' })
        } finally { setLoading(false) }
    }

    if (success) return (
        <div className="tn-auth-page tn-auth-page--register">
            <div className="tn-auth-card">
                <div className="tn-auth-success">
                    <span className="tn-auth-success__icon">🎉</span>
                    <h2 className="tn-auth-success__title">Compte creat!</h2>
                    <p className="tn-auth-success__text">Redirigint al login...</p>
                </div>
            </div>
        </div>
    )

    return (
        <div className="tn-auth-page tn-auth-page--register page-enter">
            <div className="tn-auth-card">
                <div className="tn-auth-card__header" aria-hidden="true">
                    <span className="tn-auth-card__icon">✨</span>
                </div>
                <div className="tn-auth-card__body">
                    <h1 className="tn-auth-card__title">Crea el teu compte</h1>
                    <p className="tn-auth-card__subtitle">Uneix-te a la comunitat de viatgers</p>

                    {errors.api && (
                        <div className="tn-auth-alert tn-auth-alert--error" role="alert" aria-live="assertive">
                            ⚠️ {errors.api}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate aria-label="Formulari de registre">
                        <div className={`tn-auth-form-group ${errors.full_name ? 'tn-auth-form-group--error' : ''}`}>
                            <label htmlFor="reg-name">Nom complet</label>
                            <input id="reg-name" name="full_name" type="text" value={form.full_name}
                                   onChange={handleChange} placeholder="Maria García" required autoComplete="name"
                                   aria-required="true" aria-describedby={errors.full_name ? 'err-name' : undefined} />
                            {errors.full_name && <span id="err-name" className="tn-auth-field-hint" role="alert" style={{color:'var(--tn-danger)'}}>⚠️ {errors.full_name}</span>}
                        </div>

                        <div className={`tn-auth-form-group ${errors.email ? 'tn-auth-form-group--error' : ''}`}>
                            <label htmlFor="reg-email">Adreça de correu</label>
                            <input id="reg-email" name="email" type="email" value={form.email}
                                   onChange={handleChange} placeholder="nom@example.com" required autoComplete="email"
                                   aria-required="true" aria-describedby={errors.email ? 'err-email' : undefined} />
                            {errors.email && <span id="err-email" className="tn-auth-field-hint" role="alert" style={{color:'var(--tn-danger)'}}>⚠️ {errors.email}</span>}
                        </div>

                        <div className={`tn-auth-form-group ${errors.password ? 'tn-auth-form-group--error' : ''}`}>
                            <label htmlFor="reg-password">Contrasenya</label>
                            <input id="reg-password" name="password" type="password" value={form.password}
                                   onChange={handleChange} placeholder="Mínim 8 caràcters" required minLength={8}
                                   autoComplete="new-password" aria-required="true" aria-describedby="pwd-strength" />
                            {form.password && (
                                <div className="tn-password-strength" id="pwd-strength" aria-live="polite"
                                     aria-label={`Fortalesa: ${STRENGTH_LABELS[strength]}`}>
                                    <div className="tn-password-strength__bar">
                                        <div className={`tn-password-strength__fill tn-password-strength__fill--${strength}`} />
                                    </div>
                                    <span className={`tn-password-strength__label tn-password-strength__label--${strength}`}>
                    {STRENGTH_LABELS[strength]}
                  </span>
                                </div>
                            )}
                            {!form.password && <span className="tn-auth-field-hint">Usa lletres, números i símbols per a més seguretat</span>}
                            {errors.password && <span className="tn-auth-field-hint" role="alert" style={{color:'var(--tn-danger)'}}>⚠️ {errors.password}</span>}
                        </div>

                        <div className={`tn-auth-form-group ${errors.confirm ? 'tn-auth-form-group--error' : ''}`}>
                            <label htmlFor="reg-confirm">Confirma la contrasenya</label>
                            <input id="reg-confirm" name="confirm" type="password" value={form.confirm}
                                   onChange={handleChange} placeholder="Repeteix la contrasenya" required
                                   autoComplete="new-password" aria-required="true"
                                   aria-describedby={errors.confirm ? 'err-confirm' : undefined} />
                            {errors.confirm && <span id="err-confirm" className="tn-auth-field-hint" role="alert" style={{color:'var(--tn-danger)'}}>⚠️ {errors.confirm}</span>}
                        </div>

                        <label className="tn-auth-checkbox">
                            <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} aria-required="true" />
                            <span className="tn-auth-checkbox__label">
                Accepto els <a href="/terms" target="_blank" rel="noopener noreferrer">termes d'ús</a> i la <a href="/privacy" target="_blank" rel="noopener noreferrer">política de privacitat</a>
              </span>
                        </label>
                        {errors.terms && <span className="tn-auth-field-hint" role="alert" style={{color:'var(--tn-danger)',display:'block',marginTop:4}}>⚠️ {errors.terms}</span>}

                        <button type="submit" className="tn-auth-submit tn-auth-submit--register"
                                disabled={loading} aria-busy={loading} style={{marginTop:16}}>
                            {loading ? '⏳ Creant compte...' : '🚀 Crear compte gratis'}
                        </button>
                    </form>

                    <div className="tn-auth-divider"><span>ja tens compte?</span></div>
                    <p className="tn-auth-card__footer-text">
                        <Link to="/login" className="tn-auth-card__link">Iniciar sessió</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}