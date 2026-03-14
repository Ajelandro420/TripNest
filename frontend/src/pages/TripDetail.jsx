// Detalle de viaje: acciones de inscripcion, estado y chat.
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuth from '../context/useAuth'
import useToast from '../components/useToast'
import api from '../api/axiosConfig'
import TripChat from '../components/TripChat'
import DestinationInfo from '../components/DestinationInfo'

function DaysCounter({ startDate, endDate }) {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    const msDay = 1000 * 60 * 60 * 24

    if (now < start) {
        const days = Math.ceil((start - now) / msDay)
        return <div className="alert alert-info mb-3" role="status">{days} dia/es per al viatge</div>
    }

    if (now >= start && now <= end) {
        const days = Math.ceil((end - now) / msDay)
        return <div className="alert alert-success mb-3" role="status">{days} dia/es restants · en curs</div>
    }

    const days = Math.floor((now - end) / msDay)
    return <div className="alert alert-secondary mb-3" role="status">{days} dia/es des que va acabar</div>
}

const STATUS_MAP = {
    Planificant: 'text-bg-primary',
    Actiu: 'text-bg-success',
    Completat: 'text-bg-secondary',
    'Cancel·lat': 'text-bg-danger',
}

function widthClassFromPct(pct) {
    if (pct <= 0) return ''
    if (pct <= 25) return 'w-25'
    if (pct <= 50) return 'w-50'
    if (pct <= 75) return 'w-75'
    return 'w-100'
}

export default function TripDetail() {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const toast = useToast()

    const [trip, setTrip] = useState(null)
    const [enrolled, setEnrolled] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get(`/trips/${id}`)
            .then((res) => {
                setTrip(res.data)
                setEnrolled(res.data.participants?.some((p) => p.id === user?.id))
            })
            .catch(() => toast.error('Error carregant el viatge.'))
            .finally(() => setLoading(false))
    }, [id, toast, user?.id])

    const handleEnroll = async () => {
        try {
            await api.post(`/trips/${id}/enroll`)
            setEnrolled(true)
            setTrip((t) => ({ ...t, user_count: t.user_count + 1 }))
            toast.success("T'has inscrit correctament")
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Error en la inscripcio')
        }
    }

    const handleLeave = async () => {
        if (!window.confirm("Segur que vols desinscriure't?")) return
        try {
            await api.post(`/trips/${id}/leave`)
            setEnrolled(false)
            setTrip((t) => ({ ...t, user_count: Math.max(0, t.user_count - 1) }))
            toast.info("T'has desinscrit del viatge")
        } catch {
            toast.error('Error en la desinscripcio')
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Segur que vols eliminar aquest viatge? No es pot desfer.')) return
        try {
            await api.delete(`/trips/${id}`)
            toast.success('Viatge eliminat correctament')
            navigate('/dashboard')
        } catch {
            toast.error('Error eliminant el viatge')
        }
    }

    if (loading) {
        return (
            <section className="py-5">
                <div className="container text-center">
                    <div className="spinner-border text-primary" role="status" aria-label="Carregant viatge" />
                </div>
            </section>
        )
    }

    if (!trip) {
        return (
            <section className="py-5">
                <div className="container text-center">
                    <h2 className="h4 mb-3">Viatge no trobat</h2>
                    <button type="button" className="btn btn-outline-primary" onClick={() => navigate('/dashboard')}>
                        Tornar al dashboard
                    </button>
                </div>
            </section>
        )
    }

    const isOwnerOrAdmin = user?.role === 'admin' || trip.creator_id === user?.id
    const pct = trip.max_user_count > 0 ? Math.min(100, Math.round((trip.user_count / trip.max_user_count) * 100)) : 0
    const full = pct >= 100

    return (
        <section className="py-4 py-md-5">
            <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
                    <div>
                        <h1 className="h3 mb-1">{trip.title}</h1>
                        <p className="text-secondary mb-0">?? {trip.destination} · ?? {trip.start_date} ? {trip.end_date}</p>
                    </div>
                    <span className={`badge fs-6 ${STATUS_MAP[trip.status] || 'text-bg-primary'}`}>{trip.status}</span>
                </div>

                {trip.start_date && trip.end_date && <DaysCounter startDate={trip.start_date} endDate={trip.end_date} />}

                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-body">
                                <h2 className="h5">Sobre el viatge</h2>
                                <p className="text-secondary mb-3">{trip.description || 'Sense descripcio disponible.'}</p>

                                <div className="d-flex justify-content-between small fw-semibold mb-1">
                                    <span>Participants</span>
                                    <span>{trip.user_count}/{trip.max_user_count}{full ? ' · Complet' : ''}</span>
                                </div>
                                <div className="progress mb-3" role="progressbar" aria-label="Percentatge ocupacio" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
                                    <div className={`progress-bar ${full ? 'bg-danger' : 'bg-success'} ${widthClassFromPct(pct)}`} />
                                </div>

                                <div className="d-flex flex-wrap gap-2">
                                    {!isOwnerOrAdmin && !enrolled && trip.status === 'Planificant' && !full && (
                                        <button type="button" className="btn btn-success" onClick={handleEnroll}>Inscriure's</button>
                                    )}
                                    {!isOwnerOrAdmin && enrolled && (
                                        <button type="button" className="btn btn-outline-secondary" onClick={handleLeave}>Desinscriure's</button>
                                    )}
                                    {isOwnerOrAdmin && (
                                        <>
                                            <button type="button" className="btn btn-outline-primary" onClick={() => navigate(`/trips/${id}/edit`)}>
                                                Editar viatge
                                            </button>
                                            <button type="button" className="btn btn-outline-danger" onClick={handleDelete}>
                                                Eliminar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DestinationInfo destination={trip.destination} />
                    </div>

                    <div className="col-12 col-lg-4">
                        {enrolled || isOwnerOrAdmin ? (
                            <TripChat tripId={id} />
                        ) : (
                            <div className="card border-0 shadow-sm">
                                <div className="card-body text-center py-4">
                                    <h2 className="h6">Xat del grup bloquejat</h2>
                                    <p className="text-secondary mb-0">Inscriu-te al viatge per accedir al xat.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

