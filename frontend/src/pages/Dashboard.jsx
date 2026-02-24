// ══════════════════════════════════════════
// Dashboard.jsx
// ══════════════════════════════════════════
import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import api                     from '../api/axiosConfig'
import TripCard                from '../components/TripCard'
import './Dashboard.css'


export default function Dashboard() {
    const [trips,   setTrips]   = useState([])
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState('')

    useEffect(() => {
        api.get('/trips')
            .then(res => setTrips(res.data))
            .catch(() => setError('Error carregant els viatges'))
            .finally(() => setLoading(false))
    }, [])

    return (
        <section className="page-enter" style={{padding:'48px 0'}}>
            <div className="tn-container">
                <h1 style={{marginBottom:'8px'}}>🗺️ Viatges disponibles</h1>
                <p style={{marginBottom:'40px'}}>Descobreix les pròximes aventures i uneix-te al teu grup ideal.</p>

                {error && <div className="tn-alert tn-alert--error" role="alert">{error}</div>}

                {loading ? (
                    <div className="tn-spinner" role="status" aria-label="Carregant viatges">
                        <div className="tn-spinner__ring" />
                        <p>Carregant viatges...</p>
                    </div>
                ) : trips.length === 0 ? (
                    <div style={{textAlign:'center', padding:'80px 0'}}>
                        <div style={{fontSize:'3rem', marginBottom:'16px'}}>🏝️</div>
                        <h3>No hi ha viatges disponibles</h3>
                        <p>Torna aviat o crea el teu propi viatge!</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '28px'
                    }} role="list" aria-label="Llistat de viatges">
                        {trips.map(trip => (
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