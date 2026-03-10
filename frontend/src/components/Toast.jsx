// ══════════════════════════════════════════
// Toast.jsx — Notificacions globals
// Ús: import { useToast } from './Toast'
//     const toast = useToast()
//     toast.success('Missatge!')
//     toast.error('Error!')
// ══════════════════════════════════════════
import { createContext, useContext, useState, useCallback } from 'react'
import './Toast.css'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const add = useCallback((message, type = 'success', duration = 4000) => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
    }, [])

    const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id))

    const toast = {
        success: (msg) => add(msg, 'success'),
        error:   (msg) => add(msg, 'error'),
        info:    (msg) => add(msg, 'info'),
        warning: (msg) => add(msg, 'warning'),
    }

    const ICONS = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' }

    return (
        <ToastCtx.Provider value={toast}>
            {children}
            <div className="tn-toast-container" role="region" aria-label="Notificacions" aria-live="polite">
                {toasts.map(t => (
                    <div key={t.id} className={`tn-toast tn-toast--${t.type}`} role="alert">
                        <span className="tn-toast__icon" aria-hidden="true">{ICONS[t.type]}</span>
                        <span className="tn-toast__msg">{t.message}</span>
                        <button className="tn-toast__close" onClick={() => remove(t.id)} aria-label="Tancar">✕</button>
                    </div>
                ))}
            </div>
        </ToastCtx.Provider>
    )
}

export const useToast = () => useContext(ToastCtx)