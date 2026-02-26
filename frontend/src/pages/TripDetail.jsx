import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth }   from '../context/AuthContext.jsx'
import api           from '../api/axiosConfig'
import TripChat      from '../components/TripChat'
import './TripDetail.css'

export default function TripDetail() {
    const { id }  = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [trip,     setTrip]     = useState(null)
    const [enrolled, setEnrolled] = useState(false)
    const [msg,      setMsg]      = useState('')
    const [msgType,  setMsgType]  = useState('success')
    const [loading,  setLoading]  = useState(true)

    useEffect(() => {
        api.get(`/trips/${id}`)
            .then(res => {
                setTrip(res.data)
                const isIn = res.data.participants?.some(p => p.id === user?.id)
                setEnrolled(isIn)
            })
            .catch(() => setMsg('Error carregant el viatge.'))
            .finally(() => setLoading(false))
    }, [id])

    const notify = (text, type = 'success') => { setMsg(text); setMsgType(type) }

    const handleEnroll = async () => {
        try {
            await api.post(`/trips/${id}/enroll`)
            setEnrolled(true)
            setTrip(t => ({ ...t, total_participants: t.total_participants + 1 }))
            notify('✅ T\'has inscrit correctament!')
        } catch (err) {
            notify(err.response?.data?.detail || 'Error en la inscripció.', 'error')
        }
    }

    const handleLeave = async () => {
        if (!window.confirm('Segur que vols desinscriure\'t d\'aquest viatge?')) return
        try {
            await api.post(`/trips/${id}/leave`)
            setEnrolled(false)
            setTrip(t => ({ ...t, total_participants: t.total_participants - 1 }))
            notify('👋 T\'has desinscrit del viatge.')
        } catch { notify('Error en la desinscripció.', 'error') }
    }

    const handleDelete = async () => {
        if (!window.confirm('Segur que vols eliminar aquest viatge? Aquesta acció no es pot desfer.')) return
        try {
            await api.delete(`/creator/trips/${id}`)
            navigate('/dashboard')
        } catch { notify('Error eliminant el viatge.', 'error') }
    }

    if (loading) return (
        <div className="tn-spinner" role="status" aria-label="Carregant viatge">
            <div className="tn-spinner__ring" /><p>Carregant viatge...</p>
        </div>
    )

    if (!trip) return (
        <div style={{textAlign:'center',padding:'80px 16px'}}>
            <div style={{fontSize:'3rem',marginBottom:16}}>😕</div>
            <h2>Viatge no trobat</h2>
        </div>
    )

    const isOwnerOrAdmin = user?.rol === 'admin' || trip.creador?.id === user?.id

    return (
        <article className="page-enter" style={{padding:'48px 0'}}>
            <div className="tn-container">
                {/* Alerta */}
                {msg && (
                    <div className={`tn-alert tn-alert--${msgType}`} role="alert" aria-live="assertive"
                         style={{marginBottom:24}}>
                        {msg}
                        <button onClick={()=>setMsg('')} style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',fontSize:'1rem'}}
                                aria-label="Tancar missatge">✕</button>
                    </div>
                )}

                <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:16,alignItems:'flex-start',marginBottom:8}}>
                    <div>
                        <h1 style={{marginBottom:6}}>{trip.nom}</h1>
                        <p style={{fontSize:'1rem',color:'var(--tn-text-muted)',margin:0}}>
                            📍 {trip.desti} &nbsp;·&nbsp; 🗓️ {trip.data_inici} → {trip.data_fi}
                        </p>
                    </div>
                    <span style={{
                        background: trip.estat === 'Actiu' ? 'rgba(23,165,137,0.12)' : 'rgba(93,173,226,0.12)',
                        color:       trip.estat === 'Actiu' ? '#0E8A74' : '#1A6FA8',
                        padding:'6px 16px', borderRadius:50, fontSize:'0.82rem', fontWeight:700,
                        whiteSpace:'nowrap', marginTop:8
                    }} aria-label={`Estat del viatge: ${trip.estat}`}>
            {trip.estat}
          </span>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:40,marginTop:32,alignItems:'start'}}
                     className="tn-detail-grid">

                    {/* Columna esquerra */}
                    <div>
                        <div className="tn-card" style={{padding:32, marginBottom:24}}>
                            <h2 style={{fontSize:'1.15rem',marginBottom:16}}>Sobre el viatge</h2>
                            <p style={{lineHeight:1.8}}>{trip.descripcio || 'Sense descripció.'}</p>

                            {/* Participants */}
                            <div style={{marginTop:24}}>
                                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.82rem',
                                    fontWeight:700,textTransform:'uppercase',letterSpacing:0.5,
                                    color:'var(--tn-text-muted)',marginBottom:8}}>
                                    <span>👥 Participants</span>
                                    <span>{trip.total_participants} / {trip.maxim_participants}</span>
                                </div>
                                <div style={{height:8,background:'rgba(26,82,118,0.08)',borderRadius:4,overflow:'hidden'}}
                                     role="progressbar"
                                     aria-valuenow={Math.round(trip.total_participants/trip.maxim_participants*100)}
                                     aria-valuemin="0" aria-valuemax="100">
                                    <div style={{
                                        height:'100%',
                                        width:`${Math.round(trip.total_participants/trip.maxim_participants*100)}%`,
                                        background:'linear-gradient(90deg,#17A589,#48C9B0)',
                                        borderRadius:4, transition:'width 0.6s'
                                    }}/>
                                </div>
                            </div>
                        </div>

                        {/* Accions */}
                        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                            {user?.rol === 'viatger' && !enrolled && trip.estat === 'Planificant' && (
                                <button className="tn-btn tn-btn--turquesa" onClick={handleEnroll}
                                        aria-label="Inscriure'm a aquest viatge">
                                    ✋ Inscriure's
                                </button>
                            )}
                            {enrolled && (
                                <button className="tn-btn tn-btn--outline" onClick={handleLeave}
                                        aria-label="Desinscriure'm d'aquest viatge">
                                    🚪 Desinscriure's
                                </button>
                            )}
                            {isOwnerOrAdmin && (
                                <>
                                    <button className="tn-btn tn-btn--sorra" onClick={()=>navigate(`/trips/${id}/edit`)}
                                            aria-label="Editar viatge">
                                        ✏️ Editar
                                    </button>
                                    <button className="tn-btn tn-btn--danger" onClick={handleDelete}
                                            aria-label="Eliminar viatge">
                                        🗑️ Eliminar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Columna dreta: Xat */}
                    <div>
                        {enrolled || isOwnerOrAdmin ? (
                            <TripChat tripId={id} />
                        ) : (
                            <div className="tn-card" style={{padding:28,textAlign:'center'}}>
                                <div style={{fontSize:'2rem',marginBottom:12}}>💬</div>
                                <p style={{fontSize:'0.9rem',color:'var(--tn-text-muted)',margin:0}}>
                                    Inscriu-te al viatge per accedir al xat del grup.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 900px) {
          .tn-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </article>
    )
}