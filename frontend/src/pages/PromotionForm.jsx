// PromotionForm.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import './PromotionForm.css'

export default function PromotionForm() {
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState(false)
    const [error,   setError]   = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (message.trim().length < 20) { setError('El missatge ha de tenir almenys 20 caràcters.'); return }
        setLoading(true); setError('')
        try {
            await api.post('/promote-request', { missatge_peticio: message })
            setSuccess(true)
        } catch { setError('Error enviant la petició. Torna-ho a intentar.') }
        finally  { setLoading(false) }
    }

    if (success) return (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh',padding:'40px 16px'}}>
            <div className="tn-card" style={{textAlign:'center',padding:'60px 40px',maxWidth:460}}>
                <div style={{fontSize:'3rem',marginBottom:'16px'}}>📬</div>
                <h2>Petició enviada!</h2>
                <p style={{marginTop:12}}>Un administrador revisarà la teva sol·licitud aviat.</p>
                <button className="tn-btn tn-btn--primary" style={{marginTop:24}} onClick={()=>navigate('/dashboard')}>
                    Tornar al Dashboard
                </button>
            </div>
        </div>
    )

    return (
        <section className="page-enter" style={{padding:'48px 0', minHeight:'60vh'}}>
            <div className="tn-container" style={{maxWidth:580}}>
                <h1 style={{marginBottom:8}}>⬆️ Demanar promoció a Creador</h1>
                <p style={{marginBottom:36}}>Explica'ns per què vols crear viatges a TripNest.</p>

                {error && <div className="tn-alert tn-alert--error" role="alert">{error}</div>}

                <div className="tn-card" style={{padding:36}}>
                    <form onSubmit={handleSubmit} aria-label="Formulari de petició de promoció">
                        <div className="tn-form-group">
                            <label htmlFor="promo-msg">
                                Per què vols ser Creador de Viatges?
                                <span style={{fontWeight:400,marginLeft:6,color:'var(--tn-text-muted)'}}>
                  (mínim 20 caràcters)
                </span>
                            </label>
                            <textarea
                                id="promo-msg"
                                rows={6}
                                value={message}
                                onChange={e=>setMessage(e.target.value)}
                                placeholder="Explica la teva experiència viatjant, els destins que t'interessen i com planificaràs els viatges..."
                                required
                                aria-required="true"
                                style={{resize:'vertical'}}
                            />
                            <small style={{color:'var(--tn-text-muted)',fontSize:'0.78rem'}}>
                                {message.length} / 20 caràcters mínims
                            </small>
                        </div>
                        <button type="submit" className="tn-btn tn-btn--turquesa tn-btn--full"
                                disabled={loading} aria-busy={loading} style={{marginTop:8}}>
                            {loading ? '⏳ Enviant...' : '📤 Enviar petició'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}