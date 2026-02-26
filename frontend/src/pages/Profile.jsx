// Profile.jsx
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api         from '../api/axiosConfig'
import './Profile.css'

export default function Profile() {
    const { user, updateUser } = useAuth()
    const [form,    setForm]    = useState({ full_name: user?.full_name || '', bio: user?.bio || '' })
    const [success, setSuccess] = useState('')
    const [error,   setError]   = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true); setError(''); setSuccess('')
        try {
            const { data } = await api.put('/users/me', form)
            updateUser(data)
            setSuccess('Perfil actualitzat correctament!')
        } catch { setError('Error actualitzant el perfil.') }
        finally { setLoading(false) }
    }

    const ROL_LABELS = { viatger: '🧳 Viatger', creador: '✈️ Creador', admin: '⚙️ Administrador' }

    return (
        <section className="page-enter" style={{padding:'48px 0', minHeight:'60vh'}}>
            <div className="tn-container" style={{maxWidth:600}}>
                <h1 style={{marginBottom:'32px'}}>👤 El meu perfil</h1>

                {/* Chip rol */}
                <div style={{
                    display:'inline-flex', alignItems:'center', gap:8,
                    background:'linear-gradient(135deg,#EBF5FB,#D4EAF7)',
                    padding:'8px 18px', borderRadius:50, marginBottom:32,
                    fontSize:'0.85rem', fontWeight:700, color:'var(--tn-mar-mig)'
                }}>
                    {ROL_LABELS[user?.rol] || user?.rol}
                </div>

                {success && <div className="tn-alert tn-alert--success" role="status">{success}</div>}
                {error   && <div className="tn-alert tn-alert--error"   role="alert">{error}</div>}

                <div className="tn-card" style={{padding:36}}>
                    <form onSubmit={handleSubmit} aria-label="Formulari d'edició de perfil">
                        <div className="tn-form-group">
                            <label htmlFor="profile-name">Nom complet</label>
                            <input id="profile-name" type="text" value={form.full_name}
                                   onChange={e=>setForm({...form,full_name:e.target.value})} required />
                        </div>
                        <div className="tn-form-group">
                            <label htmlFor="profile-email">Correu electrònic</label>
                            <input id="profile-email" type="email" value={user?.email || ''} disabled
                                   aria-describedby="email-note" style={{opacity:0.6,cursor:'not-allowed'}} />
                            <small id="email-note" style={{color:'var(--tn-text-muted)',fontSize:'0.78rem'}}>
                                El correu no es pot modificar.
                            </small>
                        </div>
                        <div className="tn-form-group">
                            <label htmlFor="profile-bio">Biografia</label>
                            <textarea id="profile-bio" rows={4} value={form.bio}
                                      onChange={e=>setForm({...form,bio:e.target.value})}
                                      placeholder="Explica't una mica... On t'agrada viatjar? Quins destins somies?"
                                      style={{resize:'vertical'}} />
                        </div>
                        <button type="submit" className="tn-btn tn-btn--primary tn-btn--full"
                                disabled={loading} aria-busy={loading}>
                            {loading ? '⏳ Guardant...' : '💾 Guardar canvis'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}