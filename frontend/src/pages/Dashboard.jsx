// ══════════════════════════════════════════
// Dashboard.jsx — Llistat de viatges amb
// cercador, filtres d'estat i destí
// ══════════════════════════════════════════
import { useEffect, useState, useMemo } from 'react'
import api      from '../api/axiosConfig'
import TripCard from '../components/TripCard'
import './Dashboard.css'

const ESTATS = ['Tots', 'Planificant', 'Actiu', 'Completat', 'Cancel·lat']

export default function Dashboard() {
    const [trips,   setTrips]   = useState([])
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState('')
    const [search,  setSearch]  = useState('')
    const [estat,   setEstat]   = useState('Tots')

    useEffect(() => {
        api.get('/trips')
            .then(res => setTrips(res.data))
            .catch(() => setError('Error carregant els viatges'))
            .finally(() => setLoading(false))
    }, [])

    // Filtratge local — ràpid i sense peticions extra
    const filtered = useMemo(() => {
        const q = search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
        return trips.filter(t => {
            const matchSearch =
                t.title?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q) ||
                t.destination?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q)
            const matchEstat = estat === 'Tots' || t.status === estat
            return matchSearch && matchEstat
        })
    }, [trips, search, estat])

    return (
        <section className="tn-dashboard page-enter">
            <div className="tn-container">

                {/* Capçalera */}
                <div className="tn-dashboard__header">
                    <div>
                        <h1 className="tn-dashboard__title">🗺️ Viatges disponibles</h1>
                        <p className="tn-dashboard__subtitle">
                            Descobreix les pròximes aventures i uneix-te al teu grup ideal.
                        </p>
                    </div>
                    <span className="tn-dashboard__count" aria-live="polite">
                        {filtered.length} {filtered.length === 1 ? 'viatge' : 'viatges'}
                    </span>
                </div>

                {/* Cerca + filtres */}
                <div className="tn-dashboard__filters" role="search">
                    <div className="tn-dashboard__search-wrap">
                        <span className="tn-dashboard__search-icon" aria-hidden="true">🔍</span>
                        <input
                            className="tn-dashboard__search"
                            type="search"
                            placeholder="Cerca per nom o destí..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            aria-label="Cercar viatges"
                        />
                        {search && (
                            <button
                                className="tn-dashboard__search-clear"
                                onClick={() => setSearch('')}
                                aria-label="Esborrar cerca"
                            >✕</button>
                        )}
                    </div>

                    <div className="tn-dashboard__estat-filters" role="group" aria-label="Filtrar per estat">
                        {ESTATS.map(e => (
                            <button
                                key={e}
                                className={`tn-dashboard__estat-btn ${estat === e ? 'tn-dashboard__estat-btn--active' : ''}`}
                                onClick={() => setEstat(e)}
                                aria-pressed={estat === e}
                            >
                                {e === 'Planificant' ? '🔵' : e === 'Actiu' ? '🟢' : e === 'Completat' ? '⚫' : e === 'Cancel·lat' ? '🔴' : '⭐'} {e}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="tn-alert tn-alert--error" role="alert">{error}</div>
                )}

                {/* Contingut */}
                {loading ? (
                    <div className="tn-spinner" role="status" aria-label="Carregant viatges">
                        <div className="tn-spinner__ring"/>
                        <p>Carregant viatges...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="tn-dashboard__empty">
                        <div aria-hidden="true">
                            {search || estat !== 'Tots' ? '🔎' : '🏝️'}
                        </div>
                        <h3>
                            {search || estat !== 'Tots'
                                ? 'Cap viatge coincideix amb la cerca'
                                : 'No hi ha viatges disponibles'}
                        </h3>
                        <p>
                            {search || estat !== 'Tots'
                                ? 'Prova amb altres paraules o elimina els filtres.'
                                : 'Torna aviat o crea el teu propi viatge!'}
                        </p>
                        {(search || estat !== 'Tots') && (
                            <button
                                className="tn-dashboard__reset"
                                onClick={() => { setSearch(''); setEstat('Tots') }}
                            >
                                Eliminar filtres
                            </button>
                        )}
                    </div>
                ) : (
                    <div
                        className="tn-dashboard__grid"
                        role="list"
                        aria-label="Llistat de viatges"
                    >
                        {filtered.map(trip => (
                            <div key={trip.id} role="listitem">
                                <TripCard trip={trip} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}