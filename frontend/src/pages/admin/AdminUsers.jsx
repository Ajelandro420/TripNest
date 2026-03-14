// Panel admin de usuarios: listado y cambios de rol.
import { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'

const ROLE_BADGE = {
    viatger: 'text-bg-primary',
    creador: 'text-bg-success',
    admin: 'text-bg-warning',
}

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState('success')

    useEffect(() => {
        api.get('/admin/users')
            .then((res) => setUsers(res.data))
            .catch(() => setMsg('Error carregant usuaris.'))
            .finally(() => setLoading(false))
    }, [])

    const changeRole = async (userId, currentRole, name) => {
        const newRole = currentRole === 'viatger' ? 'creador' : 'viatger'
        if (!window.confirm(`Canviar el rol de ${name} a "${newRole}"?`)) return
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole })
            setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
            setMsg(`Rol de ${name} actualitzat a "${newRole}".`)
            setMsgType('success')
        } catch {
            setMsg('Error canviant el rol.')
            setMsgType('error')
        }
    }

    return (
        <section className="py-4 py-md-5">
            <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
                    <div>
                        <h1 className="h3 mb-1">Gestio d'Usuaris</h1>
                        <p className="text-secondary mb-0">Gestiona els rols de tots els membres de TripNest.</p>
                    </div>
                    <span className="badge text-bg-secondary fs-6">{users.length} usuaris</span>
                </div>

                {msg && (
                    <div className={`alert ${msgType === 'success' ? 'alert-success' : 'alert-danger'} d-flex justify-content-between align-items-center`} role="alert">
                        <span>{msg}</span>
                        <button type="button" className="btn-close" aria-label="Tancar" onClick={() => setMsg('')} />
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" aria-label="Carregant" />
                    </div>
                ) : (
                    <div className="card border-0 shadow-sm">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Usuari</th>
                                        <th>Email</th>
                                        <th>Rol</th>
                                        <th>Accio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id}>
                                            <td className="text-secondary">#{String(u.id).padStart(3, '0')}</td>
                                            <td className="fw-semibold">{u.full_name}</td>
                                            <td className="text-secondary">{u.email}</td>
                                            <td><span className={`badge ${ROLE_BADGE[u.role] || 'text-bg-secondary'}`}>{u.role}</span></td>
                                            <td>
                                                {u.role !== 'admin' ? (
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${u.role === 'viatger' ? 'btn-outline-success' : 'btn-outline-warning'}`}
                                                        onClick={() => changeRole(u.id, u.role, u.full_name)}
                                                    >
                                                        {u.role === 'viatger' ? 'Promocionar' : 'Degradar'}
                                                    </button>
                                                ) : (
                                                    <span className="text-secondary small">—</span>
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



