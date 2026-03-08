import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import DestinationPicker from '../components/DestinationPicker'
import './TripCreate.css'

const EMPTY = {
    title: '', destination: '', start_date: '', end_date: '',
    description: '', max_user_count: 10
}

export default function TripCreate() {
    const [form,    setForm]    = useState(EMPTY)
    const [error,   setError]   = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('')
        if (!form.title.trim())       { setError('El nom del viatge és obligatori.'); return }
        if (!form.destination.trim()) { setError('El destí és obligatori.'); return }
        if (!form.start_date)         { setError("La data d'inici és obligatòria."); return }
        if (!form.end_date)           { setError('La data de fi és obligatòria.'); return }
        if (new Date(form.end_date) < new Date(form.start_date)) {
            setError("La data de fi no pot ser anterior a la d'inici."); return
        }
        setLoading(true)
        try {
            const { data } = await api.post('/trips/', {
                ...form,
                max_user_count: parseInt(form.max_user_count)
            })
            navigate(`/trips/${data.id}`)
        } catch (err) {
            setError(err.response?.data?.detail || 'Error creant el viatge.')
        } finally { setLoading(false) }
    }

    // Calcula dies
    const days = form.start_date && form.end_date
        ? Math.max(0, Math.ceil((new Date(form.end_date) - new Date(form.start_date)) / 86400000))
        : null

    return (
        <section className="tn-create page-enter">
            <div className="tn-container" style={{maxWidth: 680}}>

                <div className="tn-create__header">
                    <h1>✈️ Crear nou viatge</h1>
                    <p>Omple els detalls del teu viatge i comença a acceptar participants.</p>
                </div>

                {error && <div className="tn-create__error" role="alert">{error}</div>}

                <div className="tn-create__card">
                    <div className="tn-create__card-header">
                        <span>📋 Informació del viatge</span>
                    </div>

                    <form className="tn-create__form" onSubmit={handleSubmit} noValidate>

                        <div className="tn-create__field">
                            <label htmlFor="tc-title">Nom del viatge</label>
                            <input id="tc-title" name="title" type="text" value={form.title}
                                   onChange={handleChange} placeholder="Ex: Costa Amalfitana 2025" required />
                        </div>

                        {/* Selector de destí professional */}
                        <div className="tn-create__field">
                            <label>Destí</label>
                            <DestinationPicker
                                value={form.destination}
                                onChange={(val) => setForm(f => ({ ...f, destination: val }))}
                                required
                            />
                        </div>

                        <div className="tn-create__grid-2">
                            <div className="tn-create__field">
                                <label htmlFor="tc-start">Data d'inici</label>
                                <input id="tc-start" name="start_date" type="date" value={form.start_date}
                                       onChange={handleChange} required />
                            </div>
                            <div className="tn-create__field">
                                <label htmlFor="tc-end">
                                    Data de fi
                                    {days !== null && days > 0 && (
                                        <span style={{marginLeft:8,fontWeight:400,textTransform:'none',
                                            color:'#17A589',fontSize:'0.78rem'}}>
                      · {days} dia{days !== 1 ? 's' : ''}
                    </span>
                                    )}
                                </label>
                                <input id="tc-end" name="end_date" type="date" value={form.end_date}
                                       onChange={handleChange}
                                       min={form.start_date || undefined}
                                       required />
                            </div>
                        </div>

                        <div className="tn-create__field">
                            <label htmlFor="tc-max">
                                Màxim de participants
                                <span style={{marginLeft:8,fontWeight:400,textTransform:'none',color:'#b0bec5',fontSize:'0.78rem'}}>
                  (1–200)
                </span>
                            </label>
                            <div style={{display:'flex',alignItems:'center',gap:12}}>
                                <input
                                    id="tc-max" name="max_user_count" type="range"
                                    min="1" max="50" value={form.max_user_count}
                                    onChange={handleChange}
                                    style={{flex:1,accentColor:'#17A589'}}
                                />
                                <input
                                    type="number" min="1" max="200"
                                    value={form.max_user_count}
                                    onChange={handleChange} name="max_user_count"
                                    style={{width:72,padding:'10px 12px',borderRadius:10,
                                        border:'2px solid rgba(26,82,118,0.12)',
                                        background:'#f8fafc',fontSize:'0.95rem',
                                        fontWeight:700,color:'#0D2B45',outline:'none',
                                        textAlign:'center',fontFamily:'inherit'}}
                                />
                            </div>
                        </div>

                        <div className="tn-create__divider" />

                        <div className="tn-create__field">
                            <label htmlFor="tc-desc">
                                Descripció
                                <span style={{marginLeft:6,fontWeight:400,textTransform:'none',color:'#b0bec5'}}>
                  (opcional)
                </span>
                            </label>
                            <textarea id="tc-desc" name="description" value={form.description}
                                      onChange={handleChange}
                                      placeholder="Descriu el viatge, activitats, allotjament, transport..." />
                        </div>

                        <div className="tn-create__actions">
                            <button type="submit" className="tn-create__btn-submit"
                                    disabled={loading} aria-busy={loading}>
                                {loading ? '⏳ Creant viatge...' : '🚀 Crear viatge'}
                            </button>
                            <button type="button" className="tn-create__btn-cancel"
                                    onClick={() => navigate('/dashboard')}>
                                Cancel·lar
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </section>
    )
}