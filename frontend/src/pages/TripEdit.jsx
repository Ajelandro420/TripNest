// Editar viaje existente manteniendo validaciones.
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import DestinationPicker from '../components/DestinationPicker'

const EMPTY = {
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    description: '',
    max_user_count: 10,
    status: 'Planificant',
}

export default function TripEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState(EMPTY)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        api.get(`/trips/${id}`)
            .then((res) => setForm({
                title: res.data.title,
                destination: res.data.destination,
                start_date: res.data.start_date,
                end_date: res.data.end_date,
                description: res.data.description || '',
                max_user_count: res.data.max_user_count,
                status: res.data.status,
            }))
            .catch(() => setError('Error carregant el viatge.'))
            .finally(() => setLoading(false))
    }, [id])

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (new Date(form.end_date) < new Date(form.start_date)) {
            setError("La data de fi no pot ser anterior a la d'inici.")
            return
        }

        setSaving(true)
        try {
            await api.put(`/trips/${id}`, { ...form, max_user_count: parseInt(form.max_user_count, 10) })
            navigate(`/trips/${id}`)
        } catch (err) {
            setError(err.response?.data?.detail || 'Error actualitzant el viatge.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <section className="py-5">
                <div className="container text-center">
                    <div className="spinner-border text-primary" role="status" aria-label="Carregant" />
                </div>
            </section>
        )
    }

    return (
        <section className="py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                        <h1 className="h3 mb-2">Editar viatge</h1>
                        <p className="text-secondary mb-4">Modifica els detalls del viatge. Els canvis s'aplicaran immediatament.</p>

                        {error && <div className="alert alert-danger" role="alert">{error}</div>}

                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="mb-3">
                                        <label htmlFor="te-title" className="form-label">Nom del viatge</label>
                                        <input
                                            id="te-title"
                                            name="title"
                                            type="text"
                                            className="form-control"
                                            value={form.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Desti</label>
                                        <DestinationPicker
                                            value={form.destination}
                                            onChange={(val) => setForm((f) => ({ ...f, destination: val }))}
                                            required
                                        />
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="te-start" className="form-label">Data d'inici</label>
                                            <input
                                                id="te-start"
                                                name="start_date"
                                                type="date"
                                                className="form-control"
                                                value={form.start_date}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="te-end" className="form-label">Data de fi</label>
                                            <input
                                                id="te-end"
                                                name="end_date"
                                                type="date"
                                                className="form-control"
                                                value={form.end_date}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-3 mt-1">
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="te-max" className="form-label">Maxim participants</label>
                                            <input
                                                id="te-max"
                                                name="max_user_count"
                                                type="number"
                                                min="1"
                                                max="200"
                                                className="form-control"
                                                value={form.max_user_count}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="te-status" className="form-label">Estat</label>
                                            <select
                                                id="te-status"
                                                name="status"
                                                className="form-select"
                                                value={form.status}
                                                onChange={handleChange}
                                            >
                                                <option value="Planificant">Planificant</option>
                                                <option value="Actiu">Actiu</option>
                                                <option value="Completat">Completat</option>
                                                <option value="Cancel·lat">Cancel·lat</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-3 mt-3">
                                        <label htmlFor="te-desc" className="form-label">Descripcio (opcional)</label>
                                        <textarea
                                            id="te-desc"
                                            name="description"
                                            className="form-control"
                                            rows="4"
                                            value={form.description}
                                            onChange={handleChange}
                                            placeholder="Descriu el viatge..."
                                        />
                                    </div>

                                    <div className="d-flex gap-2 pt-2">
                                        <button type="submit" className="btn btn-primary" disabled={saving} aria-busy={saving}>
                                            {saving ? 'Guardant...' : 'Guardar canvis'}
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(`/trips/${id}`)}>
                                            Cancel lar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}




