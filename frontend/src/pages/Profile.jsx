import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosConfig'
import './Profile.css'

const ROLE_INFO = {
    viatger: { icon:'🧳', label:'Viatger'  },
    creador: { icon:'✈️', label:'Creador'  },
    admin:   { icon:'⚙️', label:'Admin'    },
}

export default function Profile() {
    const { user, updateUser } = useAuth()
    const navigate = useNavigate()

    const [form,     setForm]     = useState({ full_name:'', bio:'' })
    const [original, setOriginal] = useState({ full_name:'', bio:'' })
    const [stats,    setStats]    = useState(null)
    const [msg,      setMsg]      = useState('')
    const [msgType,  setMsgType]  = useState('success')
    const [loading,  setLoading]  = useState(false)

    useEffect(() => {
        if (user) {
            const init = { full_name: user.full_name||'', bio: user.bio||'' }
            setForm(init); setOriginal(init)
        }
    }, [user])

    useEffect(() => {
        api.get('/users/me/stats')
            .then(res => setStats(res.data))
            .catch(() => {})
    }, [])

    const isDirty = form.full_name !== original.full_name || form.bio !== original.bio

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.full_name.trim()) { setMsg('El nom és obligatori.'); setMsgType('error'); return }
        setLoading(true); setMsg('')
        try {
            const { data } = await api.put('/users/me', { full_name: form.full_name.trim(), bio: form.bio.trim() })
            updateUser(data)
            setOriginal({ full_name: data.full_name, bio: data.bio||'' })
            setMsg('✅ Perfil actualitzat correctament.'); setMsgType('success')
        } catch { setMsg('Error actualitzant el perfil.'); setMsgType('error') }
        finally { setLoading(false) }
    }

    if (!user) return null

    const roleInfo = ROLE_INFO[user.role] || ROLE_INFO.viatger
    const initials = user.full_name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()||'?'

    const STAT_ITEMS = [
        { val: stats?.trips_joined   ?? '—', label:'Viatges units',  icon:'🗺️' },
        { val: stats?.trips_created  ?? '—', label:'Viatges creats', icon:'✈️' },
        { val: stats?.messages_sent  ?? '—', label:'Missatges',      icon:'💬' },
        { val: stats?.days_travelled ?? '—', label:'Dies viatjats',  icon:'📅' },
    ]

    return (
        <div className="tn-profile page-enter">
            {/* Hero */}
            <div className="tn-profile__hero">
                <div className="tn-container">
                    <div className="tn-profile__hero-inner">
                        <div className="tn-profile__avatar">{initials}</div>
                        <div className="tn-profile__hero-info">
                            <h1>{user.full_name}</h1>
                            <p>{user.email}</p>
                            <span className={`tn-profile__role-badge tn-profile__role-badge--${user.role}`}>
                {roleInfo.icon} {roleInfo.label}
              </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tn-profile__body">
                <div className="tn-container">
                    <div className="tn-profile__grid">

                        {/* Columna principal */}
                        <div>
                            {user.role === 'viatger' && (
                                <div className="tn-profile__role-banner tn-profile__role-banner--viatger">
                                    <span style={{fontSize:'1.4rem',flexShrink:0}}>💡</span>
                                    <span>Ets <strong>Viatger</strong>. Si vols organitzar els teus propis viatges, <Link to="/promotion">demana la promoció a Creador</Link>.</span>
                                </div>
                            )}
                            {user.role === 'creador' && (
                                <div className="tn-profile__role-banner tn-profile__role-banner--creador">
                                    <span style={{fontSize:'1.4rem',flexShrink:0}}>✈️</span>
                                    <span>Ets <strong>Creador de Viatges</strong>. Pots crear i gestionar els teus propis viatges.</span>
                                </div>
                            )}
                            {user.role === 'admin' && (
                                <div className="tn-profile__role-banner tn-profile__role-banner--admin">
                                    <span style={{fontSize:'1.4rem',flexShrink:0}}>⚙️</span>
                                    <span>Ets <strong>Administrador</strong>. Tens accés complet a la gestió d'usuaris i peticions.</span>
                                </div>
                            )}

                            <div className="tn-profile__card">
                                <div className="tn-profile__card-header">
                                    <span>👤</span><h2>Informació personal</h2>
                                </div>
                                <div className="tn-profile__card-body">
                                    {msg && (
                                        <div className={`tn-profile__alert tn-profile__alert--${msgType}`} role="alert">{msg}</div>
                                    )}
                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="tn-profile__field">
                                            <label htmlFor="pf-name">Nom complet</label>
                                            <input id="pf-name" type="text" value={form.full_name}
                                                   onChange={e=>setForm({...form,full_name:e.target.value})}
                                                   placeholder="El teu nom complet" required />
                                        </div>
                                        <div className="tn-profile__field">
                                            <label htmlFor="pf-email">Correu electrònic</label>
                                            <input id="pf-email" type="email" value={user.email} disabled />
                                        </div>
                                        <div className="tn-profile__field">
                                            <label htmlFor="pf-bio">Biografia <span style={{fontWeight:400,textTransform:'none',color:'#b0bec5'}}>(opcional)</span></label>
                                            <textarea id="pf-bio" value={form.bio}
                                                      onChange={e=>setForm({...form,bio:e.target.value.slice(0,255)})}
                                                      placeholder="Explica una mica qui ets..." />
                                            <div className="tn-profile__char-count">{form.bio.length}/255</div>
                                        </div>
                                        {isDirty && (
                                            <div className="tn-profile__actions">
                                                <button type="submit" className="tn-profile__btn-save" disabled={loading}>
                                                    {loading ? '⏳ Guardant...' : '💾 Guardar canvis'}
                                                </button>
                                                <button type="button" className="tn-profile__btn-discard"
                                                        onClick={()=>{setForm(original);setMsg('')}}>
                                                    Descartar
                                                </button>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div>
                            <div className="tn-profile__card">
                                <div className="tn-profile__card-header">
                                    <span>📊</span><h2>Les meves estadístiques</h2>
                                </div>
                                <div className="tn-profile__card-body">
                                    <div className="tn-profile__stat-grid">
                                        {STAT_ITEMS.map(s => (
                                            <div className="tn-profile__stat" key={s.label}>
                                                <div className="tn-profile__stat-icon">{s.icon}</div>
                                                <div className="tn-profile__stat-val">{s.val}</div>
                                                <div className="tn-profile__stat-label">{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="tn-profile__id-card">
                                        <div className="tn-profile__id-label">ID d'usuari</div>
                                        <div className="tn-profile__id-value">#{String(user.id).padStart(6,'0')}</div>
                                    </div>
                                </div>
                            </div>

                            {user.role === 'admin' && (
                                <div className="tn-profile__card">
                                    <div className="tn-profile__card-header">
                                        <span>⚙️</span><h2>Panel Admin</h2>
                                    </div>
                                    <div className="tn-profile__card-body" style={{display:'flex',flexDirection:'column',gap:10}}>
                                        <button className="tn-profile__btn-save" onClick={()=>navigate('/admin/users')} style={{padding:'10px'}}>
                                            👥 Gestió d'usuaris
                                        </button>
                                        <button className="tn-profile__btn-save" onClick={()=>navigate('/admin/requests')}
                                                style={{padding:'10px',background:'linear-gradient(135deg,#17A589,#48C9B0)'}}>
                                            📋 Peticions
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}