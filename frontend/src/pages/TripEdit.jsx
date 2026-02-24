// TripEdit.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import './TripForm.css'

export default function TripEdit() {
    const { id }  = useParams()
    const navigate = useNavigate()
    const [form,    setForm]    = useState(null)
    const [error,   setError]   = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        api.get(`/trips/${id}`)
            .then(res => setForm({
                nom:                res.data.nom,
                desti:              res.data.desti,
                data_inici:         res.data.data_inici,
                data_fi:            res.data.data_fi,
                descripcio:         res.data.descripcio || '',
                maxim_participants: res.data.maxim_participants,
                estat:              res.data.estat,
            }))
            .catch(() => setError('Error carregant el viatge.'))
    }, [id])

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setLoading(true)
        try {
            await api.put(`/creator/trips/${id}`, {
                ...form, maxim_participants: parseInt(form.maxim_participants)
            })
            navigate(`/trips/${id}`)
        } catch (err) {
            setError(err.response?.data?.detail || 'Error actualitzant el viatge.')
        } finally { setLoading(false) }
    }

    if (!form) return (
        <div className="tn-spinner" role="status" aria-label="Carregant">
            <div className="tn-spinner__ring" /><p>Carregant...</p>
        </div>
    )

    return (
        <section className="page-enter" style={{padding:'48px 0', minHeight:'60vh'}}>
            <div className="tn-container" style={{maxWidth:640}}>
                <h1 style={{marginBottom:8}}>✏️ Editar viatge</h1>
                <p style={{marginBottom:36}}>Modifica els detalls del viatge.</p>

                {error && <div className="tn-alert tn-alert--error" role="alert">{error}</div>}

                <div className="tn-card" style={{padding:36}}>
                    <form onSubmit={handleSubmit} noValidate aria-label="Formulari d'edició de viatge">
                        <div className="tn-form-group">
                            <label htmlFor="te-nom">Nom del viatge</label>
                            <input id="te-nom" name="nom" type="text" value={form.nom} onChange={handleChange} required />
                        </div>
                        <div className="tn-form-group">
                            <label htmlFor="te-desti">Destí</label>
                            <input id="te-desti" name="desti" type="text" value={form.desti} onChange={handleChange} required />
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                            <div className="tn-form-group">
                                <label htmlFor="te-inici">Data d'inici</label>
                                <input id="te-inici" name="data_inici" type="date" value={form.data_inici} onChange={handleChange} required />
                            </div>
                            <div className="tn-form-group">
                                <label htmlFor="te-fi">Data de fi</label>
                                <input id="te-fi" name="data_fi" type="date" value={form.data_fi} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="tn-form-group">
                            <label htmlFor="te-max">Màxim participants</label>
                            <input id="te-max" name="maxim_participants" type="number" min="1"
                                   value={form.maxim_participants} onChange={handleChange} required />
                        </div>
                        <div className="tn-form-group">
                            <label htmlFor="te-estat">Estat</label>
                            <select id="te-estat" name="estat" value={form.estat} onChange={handleChange}>
                                <option value="Planificant">Planificant</option>
                                <option value="Actiu">Actiu</option>
                                <option value="Completat">Completat</option>
                                <option value="Cancel·lat">Cancel·lat</option>
                            </select>
                        </div>
                        <div className="tn-form-group">
                            <label htmlFor="te-desc">Descripció</label>
                            <textarea id="te-desc" name="descripcio" rows={4} value={form.descripcio}
                                      onChange={handleChange} style={{resize:'vertical'}} />
                        </div>
                        <div style={{display:'flex',gap:12,marginTop:8}}>
                            <button type="button" className="tn-btn tn-btn--outline"
                                    onClick={()=>navigate(`/trips/${id}`)}>Cancel·lar</button>
                            <button type="submit" className="tn-btn tn-btn--primary" style={{flex:1}}
                                    disabled={loading} aria-busy={loading}>
                                {loading ? '⏳ Guardant...' : '💾 Guardar canvis'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}