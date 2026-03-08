import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import DestinationPicker from '../components/DestinationPicker'
import './TripEdit.css'

const EMPTY = { title:'', destination:'', start_date:'', end_date:'', description:'', max_user_count:10, status:'Planificant' }

export default function TripEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form,    setForm]    = useState(EMPTY)
    const [error,   setError]   = useState('')
    const [loading, setLoading] = useState(true)
    const [saving,  setSaving]  = useState(false)

    useEffect(() => {
        api.get(`/trips/${id}`)
            .then(res => setForm({
                title:          res.data.title,
                destination:    res.data.destination,
                start_date:     res.data.start_date,
                end_date:       res.data.end_date,
                description:    res.data.description || '',
                max_user_count: res.data.max_user_count,
                status:         res.data.status,
            }))
            .catch(() => setError('Error carregant el viatge.'))
            .finally(() => setLoading(false))
    }, [id])

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('')
        if (new Date(form.end_date) < new Date(form.start_date)) {
            setError("La data de fi no pot ser anterior a la d'inici."); return
        }
        setSaving(true)
        try {
            await api.put(`/trips/${id}`, { ...form, max_user_count: parseInt(form.max_user_count) })
            navigate(`/trips/${id}`)
        } catch (err) {
            setError(err.response?.data?.detail || 'Error actualitzant el viatge.')
        } finally { setSaving(false) }
    }

    if (loading) return (
        <div className="tn-spinner"><div className="tn-spinner__ring"/><p>Carregant...</p></div>
    )

    return (
        <section className="tn-edit page-enter">
            <div className="tn-container" style={{maxWidth:680}}>
                <div className="tn-edit__header">
                    <h1>✏️ Editar viatge</h1>
                    <p>Modifica els detalls del viatge. Els canvis s'aplicaran immediatament.</p>
                </div>

                {error && <div className="tn-edit__error" role="alert">{error}</div>}

                <div className="tn-edit__card">
                    <div className="tn-edit__card-header">
                        <span>📋 Informació del viatge</span>
                    </div>
                    <form className="tn-edit__form" onSubmit={handleSubmit} noValidate>

                        <div className="tn-edit__field">
                            <label htmlFor="te-title">Nom del viatge</label>
                            <input id="te-title" name="title" type="text" value={form.title} onChange={handleChange} required />
                        </div>

                        <div className="tn-edit__field">
                            <label htmlFor="te-dest">Destí</label>
                            <DestinationPicker value={form.destination} onChange={(val) => setForm(f => ({ ...f, destination: val }))} required />
                        </div>

                        <div className="tn-edit__grid-2">
                            <div className="tn-edit__field">
                                <label htmlFor="te-start">Data d'inici</label>
                                <input id="te-start" name="start_date" type="date" value={form.start_date} onChange={handleChange} required />
                            </div>
                            <div className="tn-edit__field">
                                <label htmlFor="te-end">Data de fi</label>
                                <input id="te-end" name="end_date" type="date" value={form.end_date} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="tn-edit__grid-2">
                            <div className="tn-edit__field">
                                <label htmlFor="te-max">Màxim participants</label>
                                <input id="te-max" name="max_user_count" type="number" min="1" max="200" value={form.max_user_count} onChange={handleChange} required />
                            </div>
                            <div className="tn-edit__field">
                                <label htmlFor="te-status">Estat</label>
                                <select id="te-status" name="status" value={form.status} onChange={handleChange}>
                                    <option value="Planificant">Planificant</option>
                                    <option value="Actiu">Actiu</option>
                                    <option value="Completat">Completat</option>
                                    <option value="Cancel·lat">Cancel·lat</option>
                                </select>
                            </div>
                        </div>

                        <div className="tn-edit__divider" />

                        <div className="tn-edit__field">
                            <label htmlFor="te-desc">Descripció <span style={{fontWeight:400,textTransform:'none',color:'#b0bec5'}}>(opcional)</span></label>
                            <textarea id="te-desc" name="description" value={form.description}
                                      onChange={handleChange} placeholder="Descriu el viatge..." />
                        </div>

                        <div className="tn-edit__actions">
                            <button type="submit" className="tn-edit__btn-save" disabled={saving} aria-busy={saving}>
                                {saving ? '⏳ Guardant...' : '💾 Guardar canvis'}
                            </button>
                            <button type="button" className="tn-edit__btn-cancel" onClick={() => navigate(`/trips/${id}`)}>
                                ✕ Cancel·lar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}