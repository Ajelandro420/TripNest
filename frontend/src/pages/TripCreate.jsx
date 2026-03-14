// Crear viaje: formulario para roles permitidos.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import DestinationPicker from '../components/DestinationPicker'

const EMPTY = {
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    description: '',
    max_user_count: 10,
}

export default function TripCreate() {
    const [form, setForm] = useState(EMPTY)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!form.title.trim()) {
            setError('El nom del viatge es obligatori.')
            return
        }
        if (!form.destination.trim()) {
            setError('El desti es obligatori.')
            return
        }
        if (!form.start_date) {
            setError("La data d'inici es obligatoria.")
            return
        }
        if (!form.end_date) {
            setError('La data de fi es obligatoria.')
            return
        }
        if (new Date(form.end_date) < new Date(form.start_date)) {
            setError("La data de fi no pot ser anterior a la d'inici.")
            return
        }

        setLoading(true)
        try {
            const { data } = await api.post('/trips/', {
                ...form,
                max_user_count: parseInt(form.max_user_count, 10),
            })
            navigate(`/trips/${data.id}`)
        } catch (err) {
            setError(err.response?.data?.detail || 'Error creant el viatge.')
        } finally {
            setLoading(false)
        }
    }

    const days = form.start_date && form.end_date
        ? Math.max(0, Math.ceil((new Date(form.end_date) - new Date(form.start_date)) / 86400000))
        : null

    return (
        <section className="py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                        <h1 className="h3 mb-2">Crear nou viatge</h1>
                        <p className="text-secondary mb-4">Omple els detalls del viatge i comenca a acceptar participants.</p>

                        {error && <div className="alert alert-danger" role="alert">{error}</div>}

                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="mb-3">
                                        <label htmlFor="tc-title" className="form-label">Nom del viatge</label>
                                        <input
                                            id="tc-title"
                                            name="title"
                                            type="text"
                                            className="form-control"
                                            value={form.title}
                                            onChange={handleChange}
                                            placeholder="Ex: Costa Amalfitana 2025"
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
                                            <label htmlFor="tc-start" className="form-label">Data d'inici</label>
                                            <input
                                                id="tc-start"
                                                name="start_date"
                                                type="date"
                                                className="form-control"
                                                value={form.start_date}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="tc-end" className="form-label">Data de fi</label>
                                            <input
                                                id="tc-end"
                                                name="end_date"
                                                type="date"
                                                className="form-control"
                                                value={form.end_date}
                                                onChange={handleChange}
                                                min={form.start_date || undefined}
                                                required
                                            />
                                            {days !== null && days > 0 && (
                                                <small className="text-success">Durada: {days} dia{days !== 1 ? 's' : ''}</small>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <label htmlFor="tc-max" className="form-label">Maxim de participants (1-200)</label>
                                        <div className="row g-2 align-items-center">
                                            <div className="col">
                                                <input
                                                    id="tc-max"
                                                    name="max_user_count"
                                                    type="range"
                                                    min="1"
                                                    max="50"
                                                    className="form-range"
                                                    value={form.max_user_count}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-auto">
                                                <input
                                                    type="number"
                                                    name="max_user_count"
                                                    min="1"
                                                    max="200"
                                                    className="form-control"
                                                    value={form.max_user_count}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3 mt-3">
                                        <label htmlFor="tc-desc" className="form-label">Descripcio (opcional)</label>
                                        <textarea
                                            id="tc-desc"
                                            name="description"
                                            className="form-control"
                                            rows="4"
                                            value={form.description}
                                            onChange={handleChange}
                                            placeholder="Descriu el viatge, activitats, allotjament, transport..."
                                        />
                                    </div>

                                    <div className="d-flex gap-2 pt-2">
                                        <button type="submit" className="btn btn-primary" disabled={loading} aria-busy={loading}>
                                            {loading ? 'Creant viatge...' : 'Crear viatge'}
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
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




