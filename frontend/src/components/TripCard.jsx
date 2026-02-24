import { useNavigate } from 'react-router-dom'

const BADGE_COLORS = {
    Planificant: { bg: 'rgba(93,173,226,0.15)', color: '#1A6FA8', dot: '#5DADE2' },
    Actiu:       { bg: 'rgba(23,165,137,0.12)', color: '#0E8A74', dot: '#17A589' },
    Completat:   { bg: 'rgba(127,140,141,0.12)', color: '#5D6D7E', dot: '#95A5A6' },
    'Cancel·lat':{ bg: 'rgba(231,76,60,0.1)',   color: '#C0392B', dot: '#E74C3C' },
}

export default function TripCard({ trip }) {
    const navigate = useNavigate()
    const badge    = BADGE_COLORS[trip.estat] || BADGE_COLORS['Planificant']
    const pct      = Math.round((trip.total_participants / trip.maxim_participants) * 100)

    return (
        <article
            className="tn-card tn-trip-card"
            onClick={() => navigate(`/trips/${trip.id}`)}
            style={{cursor:'pointer'}}
            aria-label={`Viatge: ${trip.nom}, destí ${trip.desti}`}
        >
            {/* Imatge / banner de color */}
            <div className="tn-trip-card__banner" aria-hidden="true">
                <span className="tn-trip-card__emoji">✈️</span>
                {/* Badge estat */}
                <span
                    className="tn-trip-card__badge"
                    style={{background: badge.bg, color: badge.color}}
                    aria-label={`Estat: ${trip.estat}`}
                >
          <span style={{width:7,height:7,borderRadius:'50%',background:badge.dot,display:'inline-block',marginRight:5}} aria-hidden="true"/>
                    {trip.estat}
        </span>
            </div>

            <div className="tn-trip-card__body">
                <h3 className="tn-trip-card__title">{trip.nom}</h3>
                <p className="tn-trip-card__dest">📍 {trip.desti}</p>
                <p className="tn-trip-card__dates">🗓️ {trip.data_inici} → {trip.data_fi}</p>
                {trip.descripcio && (
                    <p className="tn-trip-card__desc">{trip.descripcio.substring(0, 90)}...</p>
                )}

                {/* Barra de participants */}
                <div className="tn-trip-card__participants" aria-label={`${trip.total_participants} de ${trip.maxim_participants} participants`}>
                    <div className="tn-trip-card__participants-top">
                        <span>👥 Participants</span>
                        <span>{trip.total_participants} / {trip.maxim_participants}</span>
                    </div>
                    <div className="tn-trip-card__bar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
                        <div className="tn-trip-card__bar-fill" style={{width: `${pct}%`}} />
                    </div>
                </div>

                <button
                    className="tn-btn tn-btn--primary tn-btn--sm tn-btn--full"
                    onClick={e => { e.stopPropagation(); navigate(`/trips/${trip.id}`) }}
                    aria-label={`Veure detall del viatge ${trip.nom}`}
                    style={{marginTop:'16px'}}
                >
                    Veure detall →
                </button>
            </div>

            <style>{cardStyles}</style>
        </article>
    )
}

const cardStyles = `
.tn-trip-card { transition: transform 0.3s, box-shadow 0.3s; }
.tn-trip-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(13,43,69,0.16); }

.tn-trip-card__banner {
  background: linear-gradient(135deg, #0D2B45 0%, #1A5276 50%, #17A589 100%);
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tn-trip-card__emoji { font-size: 2.8rem; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3)); }

.tn-trip-card__badge {
  position: absolute;
  top: 12px; right: 12px;
  font-family: var(--tn-font-body);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 4px 10px;
  border-radius: 50px;
  display: flex;
  align-items: center;
}

.tn-trip-card__body { padding: 22px 22px 24px; }

.tn-trip-card__title {
  font-size: 1.1rem;
  margin-bottom: 6px;
  color: var(--tn-mar-profund);
  font-family: var(--tn-font-display);
}

.tn-trip-card__dest,
.tn-trip-card__dates {
  font-size: 0.82rem;
  color: var(--tn-text-muted);
  margin-bottom: 4px;
  font-weight: 400;
}

.tn-trip-card__desc {
  font-size: 0.85rem;
  color: var(--tn-text-sec);
  margin: 10px 0;
  line-height: 1.6;
  font-weight: 300;
}

.tn-trip-card__participants { margin-top: 14px; }

.tn-trip-card__participants-top {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--tn-text-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.tn-trip-card__bar {
  height: 6px;
  background: rgba(26,82,118,0.1);
  border-radius: 3px;
  overflow: hidden;
}

.tn-trip-card__bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #17A589, #48C9B0);
  border-radius: 3px;
  transition: width 0.6s ease;
}
`