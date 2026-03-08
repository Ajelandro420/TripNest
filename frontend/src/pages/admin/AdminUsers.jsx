import { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'
import './AdminUsers.css'

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
            await api.put(`/admin/users/${userId}/role`, { role: newRole })
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
            setMsg(`Rol de ${name} actualitzat a "${newRole}".`)
            setMsgType('success')
        } catch {
            setMsg('Error canviant el rol.'); setMsgType('error')
        }
    }

    return (
        <section className="tn-admin page-enter">
            <div className="tn-container">
                <div className="tn-admin__header">
                    <h1>👥 Gestió d'Usuaris</h1>
                    <p>Gestiona els rols de tots els membres de TripNest.</p>
                </div>

                {msg && (
                    <div className={`tn-admin__alert tn-admin__alert--${msgType}`} role="alert">
                        <span style={{flex:1}}>{msg}</span>
                        <button onClick={()=>setMsg('')} style={{background:'none',border:'none',cursor:'pointer',fontSize:'1.1rem',color:'inherit'}}>✕</button>
                    </div>
                )}

                {loading ? (
                    <div className="tn-spinner"><div className="tn-spinner__ring"/><p>Carregant...</p></div>
                ) : (
                    <div className="tn-admin__card">
                        <div className="tn-admin__card-header">
                            <span>👤 Membres registrats</span>
                            <span className="tn-admin__count">{users.length} usuaris</span>
                        </div>
                        <div className="tn-admin__table-wrap">
                            <table className="tn-admin__table">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Usuari</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Acció</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td><span className="tn-admin__id">#{String(u.id).padStart(3,'0')}</span></td>
                                        <td>
                                            <div className="tn-admin__name-cell">
                                                <div className="tn-admin__avatar">
                                                    {u.full_name?.charAt(0).toUpperCase()}
                                                </div>
                                                <strong>{u.full_name}</strong>
                                            </div>
                                        </td>
                                        <td style={{color:'#7f8c8d'}}>{u.email}</td>
                                        <td>
                        <span className={`tn-admin__role-badge tn-admin__role-badge--${u.role}`}>
                          {u.role}
                        </span>
                                        </td>
                                        <td>
                                            {u.role !== 'admin' && (
                                                <button
                                                    className={`tn-admin__action-btn ${u.role==='viatger' ? 'tn-admin__action-btn--promote' : 'tn-admin__action-btn--demote'}`}
                                                    onClick={() => changeRole(u.id, u.role, u.full_name)}
                                                >
                                                    {u.role === 'viatger' ? '⬆️ Promocionar' : '⬇️ Degradar'}
                                                </button>
                                            )}
                                            {u.role === 'admin' && (
                                                <span style={{fontSize:'0.75rem',color:'#aab7c4'}}>—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}