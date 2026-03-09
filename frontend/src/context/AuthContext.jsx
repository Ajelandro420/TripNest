import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import './Register.css'

/**
 * Calcula la fortaleza de una contraseña.
 *
 * @param {string} pwd - La contraseña a evaluar.
 * @returns {string|null} - Devuelve 'weak', 'fair', 'good', 'strong' o null si no hay contraseña.
 */
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

// Etiquetas para mostrar la fortaleza de la contraseña
const STRENGTH_LABELS = {
    weak: '🔴 Feble', fair: '🟠 Regular', good: '🟡 Bona', strong: '🟢 Forta',
}

/**
 * Componente de registro de usuario.
 *
 * Permite a los usuarios crear una cuenta proporcionando su nombre completo, correo electrónico,
 * contraseña y confirmando los términos de uso. Valida los datos y muestra errores si es necesario.
 */
export default function Register() {
    // Estados locales para manejar el formulario, errores, éxito y carga
    const [form,    setForm]    = useState({ full_name:'', email:'', password:'', confirm:'', terms:false })
    const [errors,  setErrors]  = useState({})
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const strength = getStrength(form.password)

    /**
     * Maneja los cambios en los campos del formulario.
     *
     * @param {Event} e - El evento de cambio.
     */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    /**
     * Valida los datos del formulario.
     *
     * @returns {Object} - Un objeto con los errores encontrados.
     */
    const validate = () => {
        const e = {}
        if (!form.full_name.trim())          e.full_name = 'El nom és obligatori.'
        if (!form.email.trim())              e.email     = 'El correu és obligatori.'
        if (form.password.length < 8)        e.password  = 'Mínim 8 caràcters.'
        if (form.password !== form.confirm)  e.confirm   = 'Les contrasenyes no coincideixen.'
        if (!form.terms)                     e.terms     = "Has d'acceptar els termes."
        return e
    }

    /**
     * Maneja el envío del formulario.
     *
     * @param {Event} e - El evento de envío.
     */
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

    // Renderiza un mensaje de éxito si el registro fue exitoso
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

    // Renderiza el formulario de registro
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
                        {/* Campos del formulario */}
                        {/* ...existing code... */}
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