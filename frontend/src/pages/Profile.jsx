import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosConfig'
import './Profile.css'

const ROL_INFO = {
    viatger: { label: '🧳 Viatger',       color: 'viatger', desc: 'Pots unir-te a viatges i xatejar amb els participants.' },
    creador: { label: '✈️ Creador',        color: 'creador', desc: 'Pots crear i gestionar els teus propis viatges.' },
    admin:   { label: '⚙️ Administrador',  color: 'admin',   desc: 'Tens accés complet a tota la plataforma.' },
}

export default function Profile() {
    const { user, updateUser } = useAuth()
    const [form,    setForm]    = useState({ full_name: user?.full_name || '', bio: user?.bio || '' })
    const [success, setSuccess] = useState('')
    const [error,   setError]   = useState('')
    const [loading, setLoading] = useState(false)
    const [edited,  setEdited]  = useState(false)

    const initials = user?.full_name?.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase() || '?'
    const rol = ROL_INFO[user?.role] || ROL_INFO.viatger

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setEdited(true)
        setSuccess('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true); setError(''); setSuccess('')
        try {
            const { data } = await api.put('/users/me', form)
            updateUser(data)
            setSuccess('Perfil actualitzat correctament!')
            setEdited(false)
        } catch {
            setError('Error actualitzant el perfil. Torna-ho a intentar.')
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setForm({ full_name: user?.full_name || '', bio: user?.bio || '' })
        setEdited(false)
        setSuccess('')
        setError('')
    }

    return (
        <div className="tn-profile page-enter">
            <div className="tn-container">

                {/* ── HERO ── */}
                <div className="tn-profile__hero">
                    <div className="tn-profile__avatar" aria-hidden="true">{initials}</div>
                    <div className="tn-profile__hero-info">
                        <h1 className="tn-profile__hero-name">{user?.full_name}</h1>
                        <p className="tn-profile__hero-email">{user?.email}</p>
                        <span className={`tn-profile__rol-chip tn-profile__rol-chip--${rol.color}`}>
              {rol.label}
            </span>
                    </div>
                </div>

                {/* ── ROL INFO BANNER ── */}
                <div className={`tn-profile__rol-banner tn-profile__rol-banner--${rol.color}`}>
                    <span className="tn-profile__rol-banner-icon">ℹ️</span>
                    <p className="tn-profile__rol-banner-text">{rol.desc}</p>
                    {user?.role === 'viatger' && (
                        <a href="/promotion" className="tn-profile__rol-banner-link">Demanar promoció →</a>
                    )}
                </div>

                <div className="tn-profile__layout">

                    {/* ── CARD EDICIÓ ── */}
                    <div className="tn-profile__card">
                        <h2 className="tn-profile__card-title">✏️ Editar informació</h2>

                        {success && (
                            <div className="tn-profile__alert tn-profile__alert--success" role="status" aria-live="polite">
                                ✅ {success}
                            </div>
                        )}
                        {error && (
                            <div className="tn-profile__alert tn-profile__alert--error" role="alert" aria-live="assertive">
                                ⚠️ {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate aria-label="Formulari d'edició de perfil">

                            <div className="tn-profile-form-group">
                                <label htmlFor="profile-name">Nom complet</label>
                                <input
                                    id="profile-name" name="full_name" type="text"
                                    value={form.full_name} onChange={handleChange}
                                    required autoComplete="name"
                                />
                            </div>

                            <div className="tn-profile-form-group">
                                <label htmlFor="profile-email">
                                    Correu electrònic
                                    <span className="tn-profile__locked-badge">🔒 No editable</span>
                                </label>
                                <input
                                    id="profile-email" type="email"
                                    value={user?.email || ''} disabled
                                    aria-describedby="email-note"
                                />
                                <span id="email-note" className="tn-profile__hint">
                  El correu electrònic no es pot modificar per seguretat.
                </span>
                            </div>

                            <div className="tn-profile-form-group">
                                <label htmlFor="profile-bio">
                                    Biografia
                                    <span className="tn-profile__char-count">{form.bio.length}/255</span>
                                </label>
                                <textarea
                                    id="profile-bio" name="bio"
                                    value={form.bio} onChange={handleChange}
                                    maxLength={255}
                                    placeholder="Explica't una mica... On t'agrada viatjar? Quins destins somies? 🌍"
                                />
                            </div>

                            <div className="tn-profile__actions">
                                <button
                                    type="submit"
                                    className="tn-btn tn-btn--primary"
                                    disabled={loading || !edited}
                                    aria-busy={loading}
                                    style={{ flex: 1 }}
                                >
                                    {loading ? '⏳ Guardant...' : '💾 Guardar canvis'}
                                </button>
                                {edited && (
                                    <button
                                        type="button"
                                        className="tn-btn tn-btn--outline"
                                        onClick={handleReset}
                                    >
                                        Descartar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* ── CARD STATS ── */}
                    <div className="tn-profile__sidebar">
                        <div className="tn-profile__stats-card">
                            <h3 className="tn-profile__stats-title">📊 Estadístiques</h3>
                            <div className="tn-profile__stats-grid">
                                <div className="tn-profile__stat">
                                    <span className="tn-profile__stat-value">—</span>
                                    <span className="tn-profile__stat-label">Viatges units</span>
                                </div>
                                <div className="tn-profile__stat">
                                    <span className="tn-profile__stat-value">—</span>
                                    <span className="tn-profile__stat-label">Viatges creats</span>
                                </div>
                                <div className="tn-profile__stat">
                                    <span className="tn-profile__stat-value">—</span>
                                    <span className="tn-profile__stat-label">Missatges enviats</span>
                                </div>
                                <div className="tn-profile__stat">
                                    <span className="tn-profile__stat-value">—</span>
                                    <span className="tn-profile__stat-label">Països visitats</span>
                                </div>
                            </div>
                        </div>

                        <div className="tn-profile__id-card">
                            <h3 className="tn-profile__stats-title">🪪 ID de compte</h3>
                            <code className="tn-profile__id-value">#{user?.id?.toString().padStart(6, '0')}</code>
                            <p className="tn-profile__hint" style={{marginTop:8}}>
                                Membre des de l'inici de TripNest
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}