// ══════════════════════════════════════════
// TripDetail.jsx — Detall del viatge amb
// comptador de dies, toast i DestinationInfo
// ══════════════════════════════════════════
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import api from '../api/axiosConfig'
import TripChat from '../components/TripChat'
import DestinationInfo from '../components/DestinationInfo'
import './TripDetail.css'

// ── Comptador de dies ──────────────────────
function DaysCounter({ startDate, endDate }) {
    const now   = new Date()
    const start = new Date(startDate)
    const end   = new Date(endDate)
    const msDay = 1000 * 60 * 60 * 24

    if (now < start) {
        const dies = Math.ceil((start - now) / msDay)
        return (
            <div className="tn-detail__days-counter tn-detail__days-counter--upcoming">
                <span className="tn-detail__days-num">{dies}</span>
                <span className="tn-detail__days-label">
                    {dies === 1 ? 'dia per al viatge' : 'dies per al viatge'} 🚀
                </span>
            </div>
        )
    }
    if (now >= start && now <= end) {
        const dies = Math.ceil((end - now) / msDay)
        return (
            <div className="tn-detail__days-counter tn-detail__days-counter--active">
                <span className="tn-detail__days-num">{dies}</span>
                <span className="tn-detail__days-label">
                    {dies === 1 ? 'dia restant' : 'dies restants'} · En curs 🟢
                </span>
            </div>
        )
    }
    const dies = Math.floor((now - end) / msDay)
    return (
        <div className="tn-detail__days-counter tn-detail__days-counter--past">
            <span className="tn-detail__days-num">{dies}</span>
            <span className="tn-detail__days-label">
                {dies === 1 ? 'dia des que va acabar' : 'dies des que va acabar'} 🏁
            </span>
        </div>
    )
}

export default function TripDetail() {
    const { id }   = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const toast    = useToast()

    const [trip,     setTrip]     = useState(null)
    const [enrolled, setEnrolled] = useState(false)
    const [loading,  setLoading]  = useState(true)

    useEffect(() => {
        api.get(`/trips/${id}`)
            .then(res => {
                setTrip(res.data)
                setEnrolled(res.data.participants?.some(p => p.id === user?.id))
            })
            .catch(() => toast.error('Error carregant el viatge.'))
            .finally(() => setLoading(false))
    }, [id])

    const handleEnroll = async () => {
        try {
            await api.post(`/trips/${id}/enroll`)
            setEnrolled(true)
            setTrip(t => ({ ...t, user_count: t.user_count + 1 }))
            toast.success("T'has inscrit correctament!")
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Error en la inscripció.')
        }
    }

    const handleLeave = async () => {
        if (!window.confirm("Segur que vols desinscriure't?")) return
        try {
            await api.post(`/trips/${id}/leave`)
            setEnrolled(false)
            setTrip(t => ({ ...t, user_count: Math.max(0, t.user_count - 1) }))
            toast.info("T'has desinscrit del viatge.")
        } catch {
            toast.error('Error en la desinscripció.')
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Segur que vols eliminar aquest viatge? No es pot desfer.')) return
        try {
            await api.delete(`/trips/${id}`)
            toast.success('Viatge eliminat correctament.')
            navigate('/dashboard')
        } catch {
            toast.error('Error eliminant el viatge.')
        }
    }

    if (loading) return (
        <div className="tn-spinner" role="status">
            <div className="tn-spinner__ring"/><p>Carregant viatge...</p>
        </div>
    )

    if (!trip) return (
        <div style={{textAlign:'center',padding:'80px 16px'}}>
            <div style={{fontSize:'3rem',marginBottom:16}}>😕</div>
            <h2>Viatge no trobat</h2>
            <button className="tn-detail__btn tn-detail__btn--edit"
                    onClick={() => navigate('/dashboard')}
                    style={{margin:'16px auto',display:'inline-flex'}}>
                ← Tornar al Dashboard
            </button>
        </div>
    )

    const isOwnerOrAdmin = user?.role === 'admin' || trip.creator_id === user?.id
    const pct  = trip.max_user_count > 0
        ? Math.min(100, Math.round((trip.user_count / trip.max_user_count) * 100)) : 0
    const full = pct >= 100

    const ESTAT_COLOR = {
        Planificant:  { bg:'rgba(93,173,226,0.12)',  color:'#1A6FA8' },
        Actiu:        { bg:'rgba(23,165,137,0.12)',   color:'#0E8A74' },
        Completat:    { bg:'rgba(127,140,141,0.12)',  color:'#5D6D7E' },
        'Cancel·lat': { bg:'rgba(231,76,60,0.1)',     color:'#C0392B' },
    }
    const estat = ESTAT_COLOR[trip.status] || ESTAT_COLOR.Planificant

    return (
        <article className="tn-detail page-enter">
            <div className="tn-container">

                {/* Capçalera */}
                <div className="tn-detail__header">
                    <div>
                        <h1 className="tn-detail__title">{trip.title}</h1>
                        <div className="tn-detail__meta">
                            <span className="tn-detail__meta-item">📍 {trip.destination}</span>
                            <span className="tn-detail__meta-item">🗓️ {trip.start_date} → {trip.end_date}</span>
                            <span className="tn-detail__meta-item">👥 {trip.user_count}/{trip.max_user_count} participants</span>
                        </div>
                    </div>
                    <span className="tn-detail__status" style={{background:estat.bg, color:estat.color}}>
                        {trip.status}
                    </span>
                </div>

                {/* Comptador de dies */}
                {trip.start_date && trip.end_date && (
                    <DaysCounter startDate={trip.start_date} endDate={trip.end_date} />
                )}

                <div className="tn-detail__grid">
                    {/* Columna esquerra */}
                    <div>
                        <div className="tn-detail__card">
                            <div className="tn-detail__card-header">
                                <span>📖 Sobre el viatge</span>
                            </div>
                            <div className="tn-detail__card-body">
                                <p className="tn-detail__desc">
                                    {trip.description || 'Sense descripció disponible.'}
                                </p>

                                {/* Barra participants */}
                                <div className="tn-detail__participants">
                                    <div className={`tn-detail__pax-row ${full ? 'tn-detail__pax-row--full' : ''}`}>
                                        <span>👥 Participants</span>
                                        <span>{trip.user_count} / {trip.max_user_count}{full && ' · Complet'}</span>
                                    </div>
                                    <div className="tn-detail__bar">
                                        <div className="tn-detail__bar-fill" style={{
                                            width:`${pct}%`,
                                            background: full
                                                ? 'linear-gradient(90deg,#E74C3C,#C0392B)'
                                                : 'linear-gradient(90deg,#17A589,#48C9B0)'
                                        }}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botons d'acció */}
                        <div className="tn-detail__actions">
                            {!isOwnerOrAdmin && !enrolled && trip.status === 'Planificant' && !full && (
                                <button className="tn-detail__btn tn-detail__btn--enroll" onClick={handleEnroll}>
                                    ✋ Inscriure's
                                </button>
                            )}
                            {!isOwnerOrAdmin && enrolled && (
                                <button className="tn-detail__btn tn-detail__btn--leave" onClick={handleLeave}>
                                    🚪 Desinscriure's
                                </button>
                            )}
                            {isOwnerOrAdmin && (
                                <>
                                    <button className="tn-detail__btn tn-detail__btn--edit"
                                            onClick={() => navigate(`/trips/${id}/edit`)}>
                                        ✏️ Editar viatge
                                    </button>
                                    <button className="tn-detail__btn tn-detail__btn--delete" onClick={handleDelete}>
                                        🗑️ Eliminar
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Info destí — fotos, mapa, temps */}
                        <DestinationInfo destination={trip.destination} />
                    </div>

                    {/* Columna dreta: Xat */}
                    <div>
                        {enrolled || isOwnerOrAdmin ? (
                            <TripChat tripId={id} />
                        ) : (
                            <div className="tn-detail__card">
                                <div className="tn-detail__card-header">
                                    <span>💬 Xat del grup</span>
                                </div>
                                <div className="tn-detail__card-body" style={{textAlign:'center',padding:'40px 28px'}}>
                                    <div style={{fontSize:'2.5rem',marginBottom:12}}>🔒</div>
                                    <p style={{color:'#7f8c8d',margin:0,fontSize:'0.9rem'}}>
                                        Inscriu-te al viatge per accedir al xat del grup.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    )
}