import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import './PromotionForm.css'

const MIN_CHARS = 20
const MAX_CHARS = 500

export default function PromotionForm() {
    const [text,    setText]    = useState('')
    const [error,   setError]   = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const chars = text.length
    const pct   = Math.min(100, Math.round((chars / MIN_CHARS) * 100))
    const ready = chars >= MIN_CHARS && chars <= MAX_CHARS

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('')
        if (!ready) { setError(`Mínim ${MIN_CHARS} caràcters. Ara en tens ${chars}.`); return }
        setLoading(true)
        try {
            await api.post('/users/promote-request', { msg_content: text })
            setSuccess(true)
        } catch (err) {
            const detail = err.response?.data?.detail || ''
            if (detail.includes('pending'))  setError('Ja tens una petició pendent. Espera la resolució.')
            else if (detail.includes('creator')) setError('Ja ets Creador de Viatges!')
            else setError(detail || 'Error enviant la petició.')
        } finally { setLoading(false) }
    }

    if (success) return (
        <section className="tn-promo page-enter">
            <div className="tn-container" style={{maxWidth:560}}>
                <div className="tn-promo__card">
                    <div className="tn-promo__success">
                        <span className="tn-promo__success-icon">🎉</span>
                        <h2>Petició enviada!</h2>
                        <p>El nostre equip revisarà la teva sol·licitud i et notificarem quan sigui aprovada. Mentrestant, continua explorant els viatges disponibles.</p>
                        <button className="tn-promo__success-btn" onClick={() => navigate('/dashboard')}>
                            🗺️ Explorar viatges
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )

    return (
        <section className="tn-promo page-enter">
            <div className="tn-container" style={{maxWidth:600}}>

                <div className="tn-promo__hero">
                    <span className="tn-promo__icon">🚀</span>
                    <h1>Converteix-te en Creador</h1>
                    <p>Explica'ns per què vols crear i organitzar viatges a TripNest. Com més detallada sigui la teva motivació, millor!</p>
                </div>

                {/* Steps */}
                <div className="tn-promo__steps">
                    <div className="tn-promo__step">
                        <span className="tn-promo__step-icon">✍️</span>
                        <h3>Escriu la petició</h3>
                        <p>Explica la teva motivació per organitzar viatges</p>
                    </div>
                    <div className="tn-promo__step">
                        <span className="tn-promo__step-icon">👀</span>
                        <h3>Revisió admin</h3>
                        <p>L'equip TripNest revisarà la teva sol·licitud</p>
                    </div>
                    <div className="tn-promo__step">
                        <span className="tn-promo__step-icon">✅</span>
                        <h3>Accés complet</h3>
                        <p>Crea i gestiona els teus propis viatges</p>
                    </div>
                </div>

                {/* Formulari */}
                <div className="tn-promo__card">
                    <div className="tn-promo__card-header">
                        <span>📝 La teva motivació</span>
                    </div>
                    <form className="tn-promo__form" onSubmit={handleSubmit} noValidate>

                        {error && <div className="tn-promo__alert tn-promo__alert--error" role="alert">{error}</div>}

                        <div className="tn-promo__field">
                            <label htmlFor="promo-text">Per què vols ser Creador de Viatges?</label>
                            <textarea
                                id="promo-text"
                                className="tn-promo__textarea"
                                value={text}
                                onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
                                placeholder="Ex: M'apassionen els viatges i vull compartir experiències úniques amb altres persones. Tinc experiència organitzant excursions i m'agradaria..."
                            />
                            <div className="tn-promo__progress">
                                <div className="tn-promo__progress-fill" style={{
                                    width: `${pct}%`,
                                    background: ready ? '#17A589' : chars > 0 ? '#E67E22' : '#ddd'
                                }}/>
                            </div>
                            <div className={`tn-promo__char-count ${ready ? 'tn-promo__char-count--ok' : chars > 0 ? 'tn-promo__char-count--warn' : ''}`}>
                                {chars}/{MAX_CHARS} {chars < MIN_CHARS ? `— mínim ${MIN_CHARS - chars} caràcters més` : '✓'}
                            </div>
                        </div>

                        <button type="submit" className="tn-promo__btn" disabled={loading || !ready}>
                            {loading ? '⏳ Enviant...' : '🚀 Enviar petició'}
                        </button>

                    </form>
                </div>
            </div>
        </section>
    )
}