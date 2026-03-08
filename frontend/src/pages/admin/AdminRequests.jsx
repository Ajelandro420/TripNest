import { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'
import './AdminRequests.css'

const ESTAT = {
    pending:  { label:'Pendent',  cls:'pending'  },
    approved: { label:'Aprovat',  cls:'approved' },
    rejected: { label:'Rebutjat', cls:'rejected' },
}

export default function AdminRequests() {
    const [requests, setRequests] = useState([])
    const [loading,  setLoading]  = useState(true)
    const [msg,      setMsg]      = useState('')
    const [msgType,  setMsgType]  = useState('success')

    useEffect(() => {
        api.get('/admin/promotions')
            .then(res => setRequests(res.data))
            .catch(() => setMsg('Error carregant les peticions.'))
            .finally(() => setLoading(false))
    }, [])

    const handleDecision = async (reqId, status, name) => {
        const label = status === 'approved' ? 'aprovar' : 'rebutjar'
        if (!window.confirm(`Segur que vols ${label} la petició de ${name}?`)) return
        try {
            await api.put(`/admin/promotions/${reqId}`, { status })
            setRequests(requests.map(r => r.id === reqId ? { ...r, status } : r))
            setMsg(`Petició de ${name} ${status === 'approved' ? 'aprovada' : 'rebutjada'}.`)
            setMsgType('success')
        } catch {
            setMsg('Error processant la petició.'); setMsgType('error')
        }
    }

    const pending  = requests.filter(r => r.status === 'pending')
    const resolved = requests.filter(r => r.status !== 'pending')

    const RequestCard = ({ r }) => {
        const st = ESTAT[r.status] || ESTAT.pending
        const name = r.user?.full_name || `Usuari #${r.user_id}`
        return (
            <div className="tn-requests__card">
                <div className="tn-requests__card-top">
                    <div style={{flex:1}}>
                        <div className="tn-requests__user-info">
                            <div className="tn-requests__avatar">
                                {name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="tn-requests__name">{name}</div>
                                <div className="tn-requests__email">{r.user?.email}</div>
                            </div>
                            <span className={`tn-requests__status-badge tn-requests__status-badge--${st.cls}`}>
                {st.label}
              </span>
                        </div>
                    </div>
                    {r.status === 'pending' && (
                        <div className="tn-requests__actions">
                            <button className="tn-requests__btn tn-requests__btn--approve"
                                    onClick={() => handleDecision(r.id, 'approved', name)}>
                                ✅ Aprovar
                            </button>
                            <button className="tn-requests__btn tn-requests__btn--reject"
                                    onClick={() => handleDecision(r.id, 'rejected', name)}>
                                ❌ Rebutjar
                            </button>
                        </div>
                    )}
                </div>
                <blockquote className="tn-requests__message">
                    "{r.msg_content}"
                </blockquote>
            </div>
        )
    }

    return (
        <section className="tn-requests page-enter">
            <div className="tn-container">
                <div className="tn-requests__header">
                    <h1>📋 Peticions de Promoció</h1>
                    <p>Revisa i gestiona les sol·licituds per ser Creador de Viatges.</p>
                </div>

                {msg && (
                    <div className={`tn-requests__alert tn-requests__alert--${msgType}`} role="alert">
                        <span style={{flex:1}}>{msg}</span>
                        <button onClick={()=>setMsg('')} style={{background:'none',border:'none',cursor:'pointer',fontSize:'1.1rem',color:'inherit'}}>✕</button>
                    </div>
                )}

                {loading ? (
                    <div className="tn-spinner"><div className="tn-spinner__ring"/><p>Carregant...</p></div>
                ) : requests.length === 0 ? (
                    <div className="tn-requests__empty">
                        <div className="tn-requests__empty-icon">📭</div>
                        <h3>Cap petició registrada</h3>
                        <p>Quan els viatgers demanin promoció apareixeran aquí.</p>
                    </div>
                ) : (
                    <>
                        {pending.length > 0 && (
                            <div style={{marginBottom:32}}>
                                <h2 style={{fontSize:'1.1rem',fontWeight:700,color:'#B7770D',marginBottom:16,
                                    display:'flex',alignItems:'center',gap:8}}>
                                    ⏳ Pendents ({pending.length})
                                </h2>
                                {pending.map(r => <RequestCard key={r.id} r={r} />)}
                            </div>
                        )}
                        {resolved.length > 0 && (
                            <div>
                                <h2 style={{fontSize:'1.1rem',fontWeight:700,color:'#7f8c8d',marginBottom:16,
                                    display:'flex',alignItems:'center',gap:8}}>
                                    ✅ Resoltes ({resolved.length})
                                </h2>
                                {resolved.map(r => <RequestCard key={r.id} r={r} />)}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}