// ══════════════════════════════════════════
// NotFound.jsx — Pàgina 404
// ══════════════════════════════════════════
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
    const navigate = useNavigate()
    return (
        <main style={{
            minHeight:'70vh', display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            textAlign:'center', padding:'40px 24px'
        }}>
            <div style={{fontSize:'5rem', marginBottom:8}}>🧭</div>
            <h1 style={{
                fontFamily:"'Playfair Display',Georgia,serif",
                fontSize:'clamp(2rem,6vw,4rem)',
                color:'#0D2B45', marginBottom:8, lineHeight:1.1
            }}>
                404
            </h1>
            <h2 style={{
                fontFamily:"'Playfair Display',Georgia,serif",
                fontSize:'clamp(1.1rem,3vw,1.6rem)',
                color:'#1A5276', marginBottom:16, fontWeight:700
            }}>
                Pàgina no trobada
            </h2>
            <p style={{
                color:'#7f8c8d', maxWidth:380, lineHeight:1.7,
                marginBottom:36, fontSize:'0.95rem'
            }}>
                Sembla que t'has perdut en alta mar. Aquesta pàgina no existeix o ha estat eliminada.
            </p>
            <div style={{display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center'}}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding:'11px 26px', borderRadius:50, border:'2px solid #1A5276',
                        background:'transparent', color:'#1A5276', fontWeight:700,
                        cursor:'pointer', fontSize:'0.92rem', transition:'all 0.2s'
                    }}
                    onMouseEnter={e => { e.target.style.background='#1A5276'; e.target.style.color='white' }}
                    onMouseLeave={e => { e.target.style.background='transparent'; e.target.style.color='#1A5276' }}
                >
                    ← Enrere
                </button>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        padding:'11px 26px', borderRadius:50, border:'none',
                        background:'linear-gradient(135deg,#0D2B45,#17A589)',
                        color:'white', fontWeight:700, cursor:'pointer',
                        fontSize:'0.92rem', boxShadow:'0 4px 15px rgba(23,165,137,0.35)'
                    }}
                >
                    🗺️ Anar als viatges
                </button>
            </div>
        </main>
    )
}