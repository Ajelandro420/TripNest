// Dashboard: lista viajes, filtros y acceso al detalle.
import { useEffect, useMemo, useState } from 'react'
import api from '../api/axiosConfig'
import TripCard from '../components/TripCard'

const ESTATS = ['Tots', 'Planificant', 'Actiu', 'Completat', 'Cancel·lat']

function normalize(text = '') {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export default function Dashboard() {
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [estat, setEstat] = useState('Tots')

    useEffect(() => {
        api.get('/trips')
            .then((res) => setTrips(res.data))
            .catch(() => setError('Error carregant els viatges'))
            .finally(() => setLoading(false))
    }, [])

    const filtered = useMemo(() => {
        const q = normalize(search)
        return trips.filter((t) => {
            const matchSearch = normalize(t.title).includes(q) || normalize(t.destination).includes(q)
            const matchStatus = estat === 'Tots' || t.status === estat
            return matchSearch && matchStatus
        })
    }, [trips, search, estat])

    return (
        <section className="py-4 py-md-5">
            <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
                    <div>
                        <h1 className="h3 mb-1">Viatges disponibles</h1>
                        <p className="text-secondary mb-0">Descobreix les properes aventures i uneix-te al teu grup ideal.</p>
                    </div>
                    <span className="badge text-bg-secondary fs-6">
                        {filtered.length} {filtered.length === 1 ? 'viatge' : 'viatges'}
                    </span>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body d-flex flex-column gap-3">
                        <div className="input-group">
                            <span className="input-group-text">Cerca</span>
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Cerca per nom o desti"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                aria-label="Cercar viatges"
                            />
                            {search && (
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setSearch('')}>
                                    Netejar
                                </button>
                            )}
                        </div>

                        <div className="d-flex flex-wrap gap-2" role="group" aria-label="Filtrar per estat">
                            {ESTATS.map((e) => (
                                <button
                                    key={e}
                                    type="button"
                                    className={`btn btn-sm ${estat === e ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setEstat(e)}
                                    aria-pressed={estat === e}
                                >
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {error && <div className="alert alert-danger" role="alert">{error}</div>}

                {loading && (
                    <div className="text-center py-5" role="status" aria-label="Carregant viatges">
                        <div className="spinner-border text-primary" />
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="alert alert-light border text-center py-4" role="status">
                        <h2 className="h5 mb-1">Cap viatge disponible</h2>
                        <p className="mb-0 text-secondary">Prova altres filtres o torna mes tard.</p>
                    </div>
                )}

                {!loading && filtered.length > 0 && (
                    <div className="row g-3" role="list" aria-label="Llistat de viatges">
                        {filtered.map((trip, index) => (
                            <div key={trip.id} className="col-12 col-md-6 col-xl-4" role="listitem">
                                <TripCard trip={trip} index={index} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}





