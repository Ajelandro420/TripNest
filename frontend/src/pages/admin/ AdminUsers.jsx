// AdminUsers.jsx
import { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'
import './Admin.css'

export default function AdminUsers() {
    const [users,   setUsers]   = useState([])
    const [loading, setLoading] = useState(true)
    const [msg,     setMsg]     = useState('')
    const [msgType, setMsgType] = useState('success')

    useEffect(() => {
        api.get('/admin/users')
            .then(res => setUsers(res.data))
            .catch(() => setMsg('Error carregant usuaris.'))
            .finally(() => setLoading(false))
    }, [])

    const changeRole = async (userId, currentRole, name) => {
        const newRole = currentRole === 'viatger' ? 'creador' : 'viatger'
        if (!window.confirm(`Canviar el rol de ${name} a "${newRole}"?`)) return
        try {
            await api.put(`/admin/users/${userId}/promote/`, { rol: newRole })
            setUsers(users.map(u => u.id === userId ? { ...u, rol: newRole } : u))
            setMsg(`Rol de ${name} actualitzat a "${newRole}".`)
            setMsgType('success')
        } catch {
            setMsg('Error canviant el rol.'); setMsgType('error')
        }
    }

    const ROL_STYLE = {
        viatger: { bg:'rgba(93,173,226,0.12)', color:'#1A6FA8' },
        creador: { bg:'rgba(23,165,137,0.12)', color:'#0E8A74' },
        admin:   { bg:'rgba(229,152,102,0.15)', color:'#B7770D' },
    }

    return (
        <section className="page-enter" style={{padding:'48px 0'}}>
            <div className="tn-container">
                <h1 style={{marginBottom:8}}>👥 Gestió d'Usuaris</h1>
                <p style={{marginBottom:32}}>Gestiona els rols de tots els membres de TripNest.</p>

                {msg && (
                    <div className={`tn-alert tn-alert--${msgType}`} role="alert" style={{marginBottom:24}}>
                        {msg}
                        <button onClick={()=>setMsg('')} style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer'}}
                                aria-label="Tancar missatge">✕</button>
                    </div>
                )}

                {loading ? (
                    <div className="tn-spinner" role="status"><div className="tn-spinner__ring"/><p>Carregant...</p></div>
                ) : (
                    <div style={{overflowX:'auto'}}>
                        <table className="tn-table" aria-label="Taula d'usuaris">
                            <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nom</th>
                                <th scope="col">Email</th>
                                <th scope="col">Rol</th>
                                <th scope="col">Acció</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(u => {
                                const st = ROL_STYLE[u.rol] || ROL_STYLE.viatger
                                return (
                                    <tr key={u.id}>
                                        <td style={{color:'var(--tn-text-muted)',fontSize:'0.82rem'}}>#{u.id}</td>
                                        <td style={{fontWeight:700}}>{u.full_name}</td>
                                        <td style={{color:'var(--tn-text-sec)'}}>{u.email}</td>
                                        <td>
                        <span style={{
                            background:st.bg, color:st.color,
                            padding:'3px 10px', borderRadius:50,
                            fontSize:'0.75rem', fontWeight:700
                        }}>
                          {u.rol}
                        </span>
                                        </td>
                                        <td>
                                            {u.rol !== 'admin' && (
                                                <button
                                                    className={`tn-btn tn-btn--sm ${u.rol==='viatger' ? 'tn-btn--turquesa' : 'tn-btn--outline'}`}
                                                    onClick={()=>changeRole(u.id, u.rol, u.full_name)}
                                                    aria-label={`Canviar rol de ${u.full_name}, actualmente ${u.rol}`}
                                                >
                                                    {u.rol === 'viatger' ? '⬆️ Promocionar' : '⬇️ Degradar'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    )
}