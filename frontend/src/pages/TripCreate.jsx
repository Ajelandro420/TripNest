// TripCreate.jsx
import { useState }    from 'react'
import { useNavigate } from 'react-router-dom'
import api             from '../api/axiosConfig'
import './TripForm.css'

const EMPTY = { nom:'', desti:'', data_inici:'', data_fi:'', descripcio:'', maxim_participants:10 }

export default function TripCreate() {
    const [form,    setForm]    = useState(EMPTY)
    const [error,   setError]   = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('')
        if (new Date(form.data_fi) < new Date(form.data_inici)) {
            setError('La data de fi no pot ser anterior a la d\'inici.'); return
        }
        setLoading(true)
        try {
            const { data } = await api.post('/creator/trips', {
                ...form,
                maxim_participants: parseInt(form.maxim_participants)
            })
            navigate(`/trips/${data.id}`)
        } catch (err) {
            setError(err.response?.data?.detail || 'Error creant el viatge.')
        } finally { setLoading(false) }
    }

    return (
        <section className="page-enter" style={{padding:'48px 0', minHeight:'60vh'}}>
            <div className="tn-container" style={{maxWidth:640}}>
                <h1 style={{marginBottom:8}}>➕ Crear nou viatge</h1>
                <p style={{marginBottom:36}}>Omple els detalls del teu viatge i comença a acceptar participants.</p>

                {error && <div className="tn-alert tn-alert--error" role="alert">{error}</div>}

                <div className="tn-card" style={{padding:36}}>
                    <form onSubmit={handleSubmit} noValidate aria-label="Formulari de creació de viatge">
                        <div className="tn-form-group">
                            <label htmlFor="tc-nom">Nom del viatge</label>
                            <input id="tc-nom" name="nom" type="text" value={form.nom}
                                   onChange={handleChange} placeholder="Ex: Costa Amalfitana 2025" required />
                        </div>
                        <div className="tn-form-group">
                            <label htmlFor="tc-desti">Destí</label>
                            <input id="tc-desti" name="desti" type="text" value={form.desti}
                                   onChange={handleChange} placeholder="Ex: Nàpols, Itàlia" required />
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                            <div className="tn-form-group">
                                <label htmlFor="tc-inici">Data d'inici</label>
                                <input id="tc-inici" name="data_inici" type="date" value={form.data_inici}
                                       onChange={handleChange} required />
                            </div>
                            <div className="tn-form-group">
                                <label htmlFor="tc-fi">Data de fi</label>
                                <input id="tc-fi" name="data_fi" type="date" value={form.data_fi}
                                       onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="tn-form-group">
                            <label htmlFor="tc-max">Màxim de participants</label>
                            <input id="tc-max" name="maxim_participants" type="number" min="1" max="200"
                                   value={form.maxim_participants} onChange={handleChange} required />
                        </div>
                        <div className="tn-form-group">
                            <label htmlFor="tc-desc">Descripció</label>
                            <textarea id="tc-desc" name="descripcio" rows={5} value={form.descripcio}
                                      onChange={handleChange} placeholder="Descriu el viatge, activitats, allotjament..."
                                      style={{resize:'vertical'}} />
                        </div>
                        <button type="submit" className="tn-btn tn-btn--primary tn-btn--full"
                                disabled={loading} aria-busy={loading} style={{marginTop:8}}>
                            {loading ? '⏳ Creant...' : '🚀 Crear viatge'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}