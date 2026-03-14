// Perfil: datos del usuario y acciones segun rol.
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../context/useAuth'
import api from '../api/axiosConfig'

const ROLE_INFO = {
    viatger: { label: 'Viatger', badge: 'text-bg-primary' },
    creador: { label: 'Creador', badge: 'text-bg-success' },
    admin: { label: 'Admin', badge: 'text-bg-warning' },
}

export default function Profile() {
    const { user, updateUser } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({ full_name: '', bio: '' })
    const [original, setOriginal] = useState({ full_name: '', bio: '' })
    const [stats, setStats] = useState(null)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState('success')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) {
            const init = { full_name: user.full_name || '', bio: user.bio || '' }
            setForm(init)
            setOriginal(init)
        }
    }, [user])

    useEffect(() => {
        api.get('/users/me/stats').then((res) => setStats(res.data)).catch(() => {})
    }, [])

    const isDirty = form.full_name !== original.full_name || form.bio !== original.bio

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.full_name.trim()) {
            setMsg('El nom es obligatori.')
            setMsgType('error')
            return
        }

        setLoading(true)
        setMsg('')
        try {
            const { data } = await api.put('/users/me', {
                full_name: form.full_name.trim(),
                bio: form.bio.trim(),
            })
            updateUser(data)
            setOriginal({ full_name: data.full_name, bio: data.bio || '' })
            setMsg('Perfil actualitzat correctament.')
            setMsgType('success')
        } catch {
            setMsg('Error actualitzant el perfil.')
            setMsgType('error')
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null

    const roleInfo = ROLE_INFO[user.role] || ROLE_INFO.viatger

    return (
        <section className="py-4 py-md-5">
            <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
                    <div>
                        <h1 className="h3 mb-1">Perfil</h1>
                        <p className="text-secondary mb-0">{user.email}</p>
                    </div>
                    <span className={`badge fs-6 ${roleInfo.badge}`}>{roleInfo.label}</span>
                </div>

                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        {user.role === 'viatger' && (
                            <div className="alert alert-info">
                                Ets Viatger. Si vols organitzar viatges, <Link to="/promotion">demana promocio a Creador</Link>.
                            </div>
                        )}
                        {user.role === 'creador' && (
                            <div className="alert alert-success">Ets Creador de Viatges. Pots crear i gestionar els teus viatges.</div>
                        )}
                        {user.role === 'admin' && (
                            <div className="alert alert-warning">Ets Administrador. Tens acces a gestio d'usuaris i peticions.</div>
                        )}

                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <h2 className="h5 mb-3">Informacio personal</h2>

                                {msg && (
                                    <div className={`alert ${msgType === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                                        {msg}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="mb-3">
                                        <label htmlFor="pf-name" className="form-label">Nom complet</label>
                                        <input
                                            id="pf-name"
                                            type="text"
                                            className="form-control"
                                            value={form.full_name}
                                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="pf-email" className="form-label">Correu electronic</label>
                                        <input id="pf-email" type="email" className="form-control" value={user.email} disabled />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="pf-bio" className="form-label">Biografia (opcional)</label>
                                        <textarea
                                            id="pf-bio"
                                            className="form-control"
                                            rows="4"
                                            value={form.bio}
                                            onChange={(e) => setForm({ ...form, bio: e.target.value.slice(0, 255) })}
                                            placeholder="Explica una mica qui ets..."
                                        />
                                        <small className="text-secondary">{form.bio.length}/255</small>
                                    </div>

                                    {isDirty && (
                                        <div className="d-flex gap-2">
                                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                                {loading ? 'Guardant...' : 'Guardar canvis'}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => {
                                                    setForm(original)
                                                    setMsg('')
                                                }}
                                            >
                                                Descartar
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-4">
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-body p-4">
                                <h2 className="h5 mb-3">Estadistiques</h2>
                                <div className="row row-cols-2 g-2 text-center">
                                    <div className="col"><div className="border rounded p-2"><strong>{stats?.trips_joined ?? '—'}</strong><div className="small text-secondary">Viatges units</div></div></div>
                                    <div className="col"><div className="border rounded p-2"><strong>{stats?.trips_created ?? '—'}</strong><div className="small text-secondary">Viatges creats</div></div></div>
                                    <div className="col"><div className="border rounded p-2"><strong>{stats?.messages_sent ?? '—'}</strong><div className="small text-secondary">Missatges</div></div></div>
                                    <div className="col"><div className="border rounded p-2"><strong>{stats?.days_travelled ?? '—'}</strong><div className="small text-secondary">Dies viatjats</div></div></div>
                                </div>
                                <p className="small text-secondary mt-3 mb-0">ID usuari: #{String(user.id).padStart(6, '0')}</p>
                            </div>
                        </div>

                        {user.role === 'admin' && (
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 d-grid gap-2">
                                    <h2 className="h5 mb-1">Panel Admin</h2>
                                    <button type="button" className="btn btn-outline-primary" onClick={() => navigate('/admin/users')}>
                                        Gestio d'usuaris
                                    </button>
                                    <button type="button" className="btn btn-outline-success" onClick={() => navigate('/admin/requests')}>
                                        Peticions
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}



