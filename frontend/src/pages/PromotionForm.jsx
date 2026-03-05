import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosConfig'
import './PromotionForm.css'

const MIN_CHARS = 20
const MAX_CHARS = 500

export default function PromotionForm() {
    const { user } = useAuth()
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState(false)
    const [error,   setError]   = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const charsOk = message.trim().length >= MIN_CHARS
    const pct     = Math.min((message.length / MAX_CHARS) * 100, 100)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!charsOk) { setError(`El missatge ha de tenir almenys ${MIN_CHARS} caràcters.`); return }
        setLoading(true); setError('')
        try {
            await api.post('/users/promote-request', { msg_content: message })
            setSuccess(true)
        } catch (err) {
            const detail = err.response?.data?.detail
            if (detail === 'You already have a pending request') {
                setError('Ja tens una petició pendent. Espera que un administrador la revisi.')
            } else if (detail === 'Only viatgers can request promotion') {
                setError('Ja ets Creador o Administrador — no necessites promoció.')
            } else {
                setError('Error enviant la petició. Torna-ho a intentar.')
            }
        } finally {
            setLoading(false)
        }
    }

    /* ── PANTALLA ÈXIT ── */
    if (success) return (
        <div className="tn-promo page-enter">
            <div className="tn-container">
                <div className="tn-promo__success">
                    <div className="tn-promo__success-card">
                        <span className="tn-promo__success-icon">📬</span>
                        <h2 className="tn-promo__success-title">Petició enviada!</h2>
                        <p className="tn-promo__success-text">
                            Un administrador revisarà la teva sol·licitud aviat.<br/>
                            Rebràs accés a crear viatges quan s'aprovi.
                        </p>
                        <button
                            className="tn-btn tn-btn--primary tn-btn--full"
                            onClick={() => navigate('/dashboard')}
                        >
                            Tornar als Viatges
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="tn-promo page-enter">
            <div className="tn-container">

                {/* Header */}
                <div className="tn-promo__header">
                    <h1 className="tn-promo__title">⬆️ Demanar promoció a Creador</h1>
                    <p className="tn-promo__subtitle">
                        Explica'ns per què vols crear viatges a TripNest i et donarem accés en 24-48h.
                    </p>
                </div>

                {/* Info banner */}
                <div className="tn-promo__info">
                    <span className="tn-promo__info-icon">✈️</span>
                    <p className="tn-promo__info-text">
                        Com a <strong>Creador</strong> podràs publicar viatges, gestionar participants
                        i utilitzar el xat en temps real. Ara ets <strong>Viatger</strong> — {user?.full_name}.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div
                        className="tn-auth-alert tn-auth-alert--error"
                        role="alert" aria-live="assertive"
                        style={{maxWidth: 620, marginBottom: 20}}
                    >
                        ⚠️ {error}
                    </div>
                )}

                {/* Card formulari */}
                <div className="tn-promo__card">
                    <form onSubmit={handleSubmit} noValidate aria-label="Formulari de petició de promoció">

                        <div className="tn-promo-form-group">
                            <label htmlFor="promo-msg">
                                Per què vols ser Creador de Viatges?
                            </label>
                            <textarea
                                id="promo-msg"
                                value={message}
                                onChange={e => setMessage(e.target.value.slice(0, MAX_CHARS))}
                                placeholder="Explica la teva experiència viatjant, els destins que t'interessen, com planificaràs els viatges i per què series un bon creador..."
                                required
                                aria-required="true"
                                aria-describedby="promo-counter"
                            />

                            {/* Barra de progrés */}
                            <div style={{marginTop: 8}}>
                                <div style={{
                                    height: 4,
                                    background: 'rgba(26,82,118,0.1)',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    marginBottom: 6
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${pct}%`,
                                        borderRadius: 2,
                                        background: charsOk
                                            ? 'linear-gradient(90deg, #17A589, #48C9B0)'
                                            : 'linear-gradient(90deg, #E59866, #F5CBA7)',
                                        transition: 'width 0.3s ease, background 0.3s ease'
                                    }} />
                                </div>
                                <div
                                    id="promo-counter"
                                    className={`tn-promo__char-count ${charsOk ? 'tn-promo__char-count--ok' : ''}`}
                                    aria-live="polite"
                                >
                                    {charsOk
                                        ? `✅ ${message.length}/${MAX_CHARS} caràcters`
                                        : `${message.length}/${MIN_CHARS} mínims requerits`
                                    }
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="tn-btn tn-btn--primary tn-btn--full"
                            disabled={loading || !charsOk}
                            aria-busy={loading}
                            style={{marginTop: 8}}
                        >
                            {loading ? '⏳ Enviant...' : '📤 Enviar petició'}
                        </button>

                        {!charsOk && message.length > 0 && (
                            <p style={{
                                textAlign: 'center',
                                fontSize: '0.8rem',
                                color: 'var(--tn-text-muted)',
                                marginTop: 8
                            }}>
                                Falten {MIN_CHARS - message.trim().length} caràcters més
                            </p>
                        )}
                    </form>
                </div>

                {/* Què passa després */}
                <div style={{
                    maxWidth: 620,
                    marginTop: 24,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 14
                }}>
                    {[
                        { icon: '📤', step: '1', text: 'Envies la petició' },
                        { icon: '👀', step: '2', text: 'Admin la revisa' },
                        { icon: '✈️', step: '3', text: 'Crees viatges!' },
                    ].map(({ icon, step, text }) => (
                        <div key={step} style={{
                            background: '#fff',
                            border: '1px solid rgba(26,82,118,0.08)',
                            borderRadius: 'var(--tn-r-md)',
                            padding: '16px 12px',
                            textAlign: 'center',
                            boxShadow: 'var(--tn-shadow-sm)'
                        }}>
                            <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{icon}</div>
                            <div style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: 'var(--tn-turquesa)',
                                marginBottom: 4,
                                letterSpacing: '0.8px'
                            }}>Pas {step}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--tn-text-sec)' }}>{text}</div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}