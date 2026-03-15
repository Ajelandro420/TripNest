// Panel admin de solicitudes: aprobar o rechazar promociones.
import { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'

const STATUS = {
    pending:  { label: 'Pendent',  badge: 'text-bg-warning' },
    approved: { label: 'Aprovat',  badge: 'text-bg-success' },
    rejected: { label: 'Rebutjat', badge: 'text-bg-danger'  },
}

export default function AdminRequests() {
    const [requests, setRequests] = useState([])
    const [loading,  setLoading]  = useState(true)
    const [msg,      setMsg]      = useState('')
    const [msgType,  setMsgType]  = useState('success')

    useEffect(() => {
        api.get('/admin/promotions')
            .then((res) => setRequests(res.data))
            .catch(() => setMsg('Error carregant les peticions.'))
            .finally(() => setLoading(false))
    }, [])

    const handleDecision = async (reqId, status, name) => {
        const action = status === 'approved' ? 'aprovar' : 'rebutjar'
        if (!window.confirm(`Segur que vols ${action} la peticio de ${name}?`)) return
        try {
            await api.put(`/admin/promotions/${reqId}`, { status })
            setRequests((prev) => prev.map((r) => (r.id === reqId ? { ...r, status } : r)))
            setMsg(`Peticio de ${name} ${status === 'approved' ? 'aprovada' : 'rebutjada'}.`)
            setMsgType('success')
        } catch {
            setMsg('Error processant la peticio.')
            setMsgType('error')
        }
    }

    const pending  = requests.filter((r) => r.status === 'pending')
    const resolved = requests.filter((r) => r.status !== 'pending')

    const RequestCard = ({ request }) => {
        const st   = STATUS[request.status] || STATUS.pending
        const name = request.user?.full_name || `Usuari #${request.user_id}`
        return (
            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <strong>{name}</strong>
                                <span className={`badge ${st.badge}`}>{st.label}</span>
                            </div>
                            <div className="text-secondary small mb-2">{request.user?.email || 'Sense correu'}</div>
                        </div>
                        {request.status === 'pending' && (
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-sm btn-outline-success"
                                        onClick={() => handleDecision(request.id, 'approved', name)}>
                                    Aprovar
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDecision(request.id, 'rejected', name)}>
                                    Rebutjar
                                </button>
                            </div>
                        )}
                    </div>
                    <blockquote className="blockquote mb-0 mt-2 small text-secondary fst-italic">
                        "{request.msg_content}"
                    </blockquote>
                </div>
            </div>
        )
    }

    return (
        <section className="py-4 py-md-5">
            <div className="container">
                <div className="mb-4">
                    <h1 className="h3 mb-1">Peticions de Promocio</h1>
                    <p className="text-secondary mb-0">Revisa i gestiona les sollicituds per ser Creador de Viatges.</p>
                </div>

                {msg && (
                    <div className={`alert ${msgType === 'success' ? 'alert-success' : 'alert-danger'} d-flex justify-content-between align-items-center`} role="alert">
                        <span>{msg}</span>
                        <button type="button" className="btn-close" aria-label="Tancar" onClick={() => setMsg('')} />
                    </div>
                )}

                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" aria-label="Carregant" />
                    </div>
                )}

                {!loading && requests.length === 0 && (
                    <div className="alert alert-light border text-center" role="status">
                        Cap peticio registrada.
                    </div>
                )}

                {!loading && pending.length > 0 && (
                    <div className="mb-4">
                        <h2 className="h5 mb-3">Pendents ({pending.length})</h2>
                        {pending.map((r) => <RequestCard key={r.id} request={r} />)}
                    </div>
                )}

                {!loading && resolved.length > 0 && (
                    <div>
                        <h2 className="h5 mb-3">Resoltes ({resolved.length})</h2>
                        {resolved.map((r) => <RequestCard key={r.id} request={r} />)}
                    </div>
                )}
            </div>
        </section>
    )
}