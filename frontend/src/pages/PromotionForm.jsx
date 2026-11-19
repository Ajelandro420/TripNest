// Formulario para solicitar promocion de rol.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

const MIN_CHARS = 20
const MAX_CHARS = 500

export default function PromotionForm() {
    const [text, setText] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const chars = text.length
    const ready = chars >= MIN_CHARS && chars <= MAX_CHARS
    const progress = chars >= MIN_CHARS ? 'w-100' : chars >= 15 ? 'w-75' : chars >= 10 ? 'w-50' : chars > 0 ? 'w-25' : 'w-0'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!ready) {
            setError(`Minim ${MIN_CHARS} caracters. Ara en tens ${chars}.`)
            return
        }

        setLoading(true)
        try {
            await api.post('/users/promote-request', { msg_content: text })
            setSuccess(true)
        } catch (err) {
            const detail = err.response?.data?.detail || ''
            if (detail.includes('pending')) setError('Ja tens una peticio pendent. Espera la resolucio.')
            else if (detail.includes('creador')) setError('Ja ets Creador de Viatges.')
            else setError(detail || 'Error enviant la peticio.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <section className="py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-7">
                            <div className="alert alert-success text-center mb-0" role="status">
                                <h2 className="h4 mb-2">Peticio enviada</h2>
                                <p className="mb-3">L'equip revisara la sol·licitud i et notificarem la resolucio.</p>
                                <button type="button" className="btn btn-success" onClick={() => navigate('/dashboard')}>
                                    Explorar viatges
                                </button>
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
                    <div className="col-12 col-lg-8">
                        <h1 className="h3 mb-2">Converteix-te en Creador</h1>
                        <p className="text-secondary mb-4">Explica per que vols crear i organitzar viatges a TripNest.</p>

                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                {error && <div className="alert alert-danger" role="alert">{error}</div>}

                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="mb-3">
                                        <label htmlFor="promo-text" className="form-label">La teva motivacio</label>
                                        <textarea
                                            id="promo-text"
                                            className="form-control"
                                            rows="7"
                                            value={text}
                                            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                                            placeholder="Explica la teva motivacio per organitzar viatges..."
                                        />
                                        <div className="progress mt-2" role="progressbar" aria-label="Progres text peticio">
                                            <div className={`progress-bar ${ready ? 'bg-success' : 'bg-warning'} ${progress}`} />
                                        </div>
                                        <small className={`d-block mt-1 ${ready ? 'text-success' : 'text-secondary'}`}>
                                            {chars}/{MAX_CHARS} {chars < MIN_CHARS ? `· falten ${MIN_CHARS - chars}` : '· correcte'}
                                        </small>
                                    </div>

                                    <button type="submit" className="btn btn-primary" disabled={loading || !ready}>
                                        {loading ? 'Enviant...' : 'Enviar peticio'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}




