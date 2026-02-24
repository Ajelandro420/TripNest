import { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'
import './Admin.css'

export default function AdminRequests() {
    const [requests, setRequests] = useState([])
    const [loading,  setLoading]  = useState(true)
    const [msg,      setMsg]      = useState('')
    const [msgType,  setMsgType]  = useState('success')

    useEffect(() => {
        api.get('/admin/promotions/')
            .then(res => setRequests(res.data))
            .catch(() => setMsg('Error carregant les peticions.'))
            .finally(() => setLoading(false))
    }, [])

    const handleDecision = async (reqId, decision, name) => {
        const label = decision === 'Aprovat' ? 'aprovar' : 'rebutjar'
        if (!window.confirm(`Segur que vols ${label} la petició de ${name}?`)) return
        try {
            await api.put(`/admin/promotions/${reqId}/`, { estat: decision })
            setRequests(requests.map(r => r.id === reqId ? { ...r, estat: decision } : r))
            setMsg(`Petició de ${name} ${decision.toLowerCase()} correctament.`)
            setMsgType('success')
        } catch {
            setMsg('Error processant la petició.'); setMsgType('error')
        }
    }

    const ESTAT_STYLE = {
        Pendent:  { bg:'rgba(229,152,102,0.12)', color:'#B7770D' },
        Aprovat:  { bg:'rgba(23,165,137,0.12)',  color:'#0E8A74' },
        Rebutjat: { bg:'rgba(231,76,60,0.1)',    color:'#C0392B' },
    }

    return (
        <section className="page-enter" style={{padding:'48px 0'}}>
            <div className="tn-container">
                <h1 style={{marginBottom:8}}>📋 Peticions de Promoció</h1>
                <p style={{marginBottom:32}}>Revisa i gestiona les sol·licituds per ser Creador de Viatges.</p>

                {msg && (
                    <div className={`tn-alert tn-alert--${msgType}`} role="alert" style={{marginBottom:24}}>
                        {msg}
                        <button onClick={()=>setMsg('')} style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer'}}
                                aria-label="Tancar missatge">✕</button>
                    </div>
                )}

                {loading ? (
                    <div className="tn-spinner" role="status"><div className="tn-spinner__ring"/><p>Carregant...</p></div>
                ) : requests.length === 0 ? (
                    <div style={{textAlign:'center',padding:'60px 0'}}>
                        <div style={{fontSize:'2.5rem',marginBottom:12}}>📭</div>
                        <h3>Cap petició pendent</h3>
                    </div>
                ) : (
                    <div style={{display:'flex',flexDirection:'column',gap:16}} role="list"
                         aria-label="Llistat de peticions de promoció">
                        {requests.map(r => {
                            const st = ESTAT_STYLE[r.estat] || ESTAT_STYLE.Pendent
                            return (
                                <article key={r.id} className="tn-card" style={{padding:24}} role="listitem"
                                         aria-label={`Petició de ${r.usuari_solicitant?.full_name}`}>
                                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:16,flexWrap:'wrap'}}>
                                        <div style={{flex:1}}>
                                            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
                                                <strong style={{fontSize:'1rem'}}>{r.usuari_solicitant?.full_name}</strong>
                                                <span style={{fontSize:'0.8rem',color:'var(--tn-text-muted)'}}>{r.usuari_solicitant?.email}</span>
                                                <span style={{
                                                    background:st.bg, color:st.color,
                                                    padding:'2px 10px', borderRadius:50, fontSize:'0.72rem', fontWeight:700
                                                }}>{r.estat}</span>
                                            </div>
                                            <p style={{margin:0,fontSize:'0.9rem',lineHeight:1.7,color:'var(--tn-text-sec)'}}>
                                                {r.missatge_peticio}
                                            </p>
                                        </div>
                                        {r.estat === 'Pendent' && (
                                            <div style={{display:'flex',gap:8,flexShrink:0}}>
                                                <button className="tn-btn tn-btn--turquesa tn-btn--sm"
                                                        onClick={()=>handleDecision(r.id,'Aprovat',r.usuari_solicitant?.full_name)}
                                                        aria-label={`Aprovar petició de ${r.usuari_solicitant?.full_name}`}>
                                                    ✅ Aprovar
                                                </button>
                                                <button className="tn-btn tn-btn--danger tn-btn--sm"
                                                        onClick={()=>handleDecision(r.id,'Rebutjat',r.usuari_solicitant?.full_name)}
                                                        aria-label={`Rebutjar petició de ${r.usuari_solicitant?.full_name}`}>
                                                    ❌ Rebutjar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}