import { useNavigate } from 'react-router-dom'
import './TripCard.css'

const BADGE = {
    Planificant:  { bg:'rgba(93,173,226,0.15)',  color:'#1A6FA8', dot:'#5DADE2' },
    Actiu:        { bg:'rgba(23,165,137,0.12)',   color:'#0E8A74', dot:'#17A589' },
    Completat:    { bg:'rgba(127,140,141,0.12)',  color:'#5D6D7E', dot:'#95A5A6' },
    'Cancel·lat': { bg:'rgba(231,76,60,0.1)',     color:'#C0392B', dot:'#E74C3C' },
}
const BANNERS = [
    'linear-gradient(135deg,#0D2B45 0%,#1A5276 55%,#17A589 100%)',
    'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)',
    'linear-gradient(135deg,#0D2B45 0%,#17A589 100%)',
    'linear-gradient(135deg,#1A5276 0%,#48C9B0 100%)',
]
const EMOJIS = ['✈️','🏝️','🗺️','⛵','🏔️','🌍','🧳','🚂']

export default function TripCard({ trip, index = 0 }) {
    const navigate = useNavigate()
    const badge  = BADGE[trip.status] || BADGE.Planificant
    const pct    = trip.max_user_count > 0
        ? Math.min(100, Math.round((trip.user_count / trip.max_user_count) * 100)) : 0
    const full   = pct >= 100
    const banner = BANNERS[index % BANNERS.length]
    const emoji  = EMOJIS[index % EMOJIS.length]

    return (
        <article
            className="tn-trip-card"
            onClick={() => navigate(`/trips/${trip.id}`)}
            tabIndex={0}
            role="button"
            aria-label={`Viatge ${trip.title} a ${trip.destination}`}
            onKeyDown={e => e.key === 'Enter' && navigate(`/trips/${trip.id}`)}
        >
            <div className="tn-trip-card__banner" style={{background: banner}}>
                <div className="tn-trip-card__banner-glow" />
                <span className="tn-trip-card__emoji" aria-hidden="true">{emoji}</span>
                <span className="tn-trip-card__badge" style={{background:badge.bg, color:badge.color}}>
          <span className="tn-trip-card__badge-dot" style={{background:badge.dot}} aria-hidden="true"/>
                    {trip.status}
        </span>
            </div>

            <div className="tn-trip-card__body">
                <h3 className="tn-trip-card__title">{trip.title}</h3>
                <div className="tn-trip-card__meta">
                    <span>📍 {trip.destination}</span>
                    <span>🗓️ {trip.start_date?.slice(0,10)}</span>
                </div>
                {trip.description && (
                    <p className="tn-trip-card__desc">
                        {trip.description.length > 80 ? trip.description.substring(0,80)+'...' : trip.description}
                    </p>
                )}
                <div className="tn-trip-card__participants">
                    <div className={`tn-trip-card__pax-row ${full ? 'tn-trip-card__pax-row--full' : ''}`}>
                        <span>👥 Participants</span>
                        <span>{trip.user_count}/{trip.max_user_count}{full && ' · Complet'}</span>
                    </div>
                    <div className="tn-trip-card__bar">
                        <div className="tn-trip-card__bar-fill" style={{
                            width:`${pct}%`,
                            background: full
                                ? 'linear-gradient(90deg,#E74C3C,#C0392B)'
                                : 'linear-gradient(90deg,#17A589,#48C9B0)'
                        }}/>
                    </div>
                </div>
                <button
                    className="tn-trip-card__btn"
                    onClick={e => { e.stopPropagation(); navigate(`/trips/${trip.id}`) }}
                    aria-label={`Veure detall de ${trip.title}`}
                >
                    Veure detall →
                </button>
            </div>
        </article>
    )
}