// Tarjeta resumen de viaje para listados (dashboard/home).
import { useNavigate } from 'react-router-dom'

const BADGE = {
    Planificant: { cls: 'text-bg-primary' },
    Actiu: { cls: 'text-bg-success' },
    Completat: { cls: 'text-bg-secondary' },
    'Cancel·lat': { cls: 'text-bg-danger' },
}

const EMOJIS = ['??', '???', '???', '?', '???', '??', '??', '??']

function widthClassFromPct(pct) {
    if (pct <= 0) return ''
    if (pct <= 25) return 'w-25'
    if (pct <= 50) return 'w-50'
    if (pct <= 75) return 'w-75'
    return 'w-100'
}

export default function TripCard({ trip, index = 0 }) {
    const navigate = useNavigate()
    const badge = BADGE[trip.status] || BADGE.Planificant
    const pct = trip.max_user_count > 0 ? Math.min(100, Math.round((trip.user_count / trip.max_user_count) * 100)) : 0
    const full = pct >= 100
    const emoji = EMOJIS[index % EMOJIS.length]

    return (
        <article className="card h-100 border-0 shadow-sm">
            <div className="card-header border-0 text-white bg-primary d-flex justify-content-between align-items-center">
                <span className="fs-4" aria-hidden="true">{emoji}</span>
                <span className={`badge rounded-pill ${badge.cls}`}>{trip.status}</span>
            </div>

            <div className="card-body d-flex flex-column">
                <h3 className="h5 card-title mb-2">{trip.title}</h3>
                <p className="small text-secondary mb-2">?? {trip.destination}</p>
                <p className="small text-secondary mb-3">?? {trip.start_date?.slice(0, 10)}</p>

                {trip.description && (
                    <p className="card-text text-secondary small">
                        {trip.description.length > 110 ? `${trip.description.substring(0, 110)}...` : trip.description}
                    </p>
                )}

                <div className="mt-auto pt-2">
                    <div className="d-flex justify-content-between small fw-semibold mb-1">
                        <span>Participants</span>
                        <span>{trip.user_count}/{trip.max_user_count}{full ? ' · Complet' : ''}</span>
                    </div>
                    <div className="progress mb-3" role="progressbar" aria-label="Percentatge ocupacio" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
                        <div className={`progress-bar ${full ? 'bg-danger' : 'bg-success'} ${widthClassFromPct(pct)}`} />
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={() => navigate(`/trips/${trip.id}`)}
                        aria-label={`Veure detall de ${trip.title}`}
                    >
                        Veure detall
                    </button>
                </div>
            </div>
        </article>
    )
}


