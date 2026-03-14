// Tarjeta resumen de viaje para listados (dashboard/home).
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BADGE = {
    Planificant: { cls: 'text-bg-primary' },
    Actiu: { cls: 'text-bg-success' },
    Completat: { cls: 'text-bg-secondary' },
    'Cancel·lat': { cls: 'text-bg-danger' },
}

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY

function widthClassFromPct(pct) {
    if (pct <= 0) return ''
    if (pct <= 25) return 'w-25'
    if (pct <= 50) return 'w-50'
    if (pct <= 75) return 'w-75'
    return 'w-100'
}

function buildFallbackImage(trip) {
    const seed = encodeURIComponent((trip.destination || trip.title || 'travel').toLowerCase())
    return `https://picsum.photos/seed/${seed}/640/360`
}

async function fetchDestinationImage(trip) {
    if (!UNSPLASH_KEY) return null

    const queryBase = (trip.destination || trip.title || 'travel').trim()
    const query = `${queryBase} city travel landmark`
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`

    const res = await fetch(url, {
        headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
    })

    if (!res.ok) return null

    const data = await res.json()
    return data?.results?.[0]?.urls?.regular || null
}

export default function TripCard({ trip }) {
    const navigate = useNavigate()
    const badge = BADGE[trip.status] || BADGE.Planificant
    const pct = trip.max_user_count > 0 ? Math.min(100, Math.round((trip.user_count / trip.max_user_count) * 100)) : 0
    const full = pct >= 100

    const [imageUrl, setImageUrl] = useState(buildFallbackImage(trip))

    useEffect(() => {
        let active = true

        fetchDestinationImage(trip)
            .then((url) => {
                if (!active || !url) return
                setImageUrl(url)
            })
            .catch(() => {
                // Fallback already set.
            })

        return () => {
            active = false
        }
    }, [trip])

    return (
        <article className="card h-100 border-0 shadow-sm overflow-hidden">
            <div className="position-relative">
                <img
                    src={imageUrl}
                    alt={`Vista de ${trip.destination}`}
                    className="card-img-top"
                    loading="lazy"
                />
                <span className={`badge ${badge.cls} position-absolute top-0 end-0 m-2`}>{trip.status}</span>
            </div>

            <div className="card-body d-flex flex-column">
                <h3 className="h5 card-title mb-2">{trip.title}</h3>
                <p className="small text-secondary mb-2">Desti: {trip.destination}</p>
                <p className="small text-secondary mb-3">Data inici: {trip.start_date?.slice(0, 10)}</p>

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

