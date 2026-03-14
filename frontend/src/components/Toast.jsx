// Provider de toasts: pinta avisos flotantes y los cierra automaticamente.
import { useCallback, useState } from 'react'
import ToastContext from './toast-context'

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const add = useCallback((message, type = 'success', duration = 4000) => {
        const id = Date.now()
        setToasts((prev) => [...prev, { id, message, type }])
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration)
    }, [])

    const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

    const toast = {
        success: (msg) => add(msg, 'success'),
        error: (msg) => add(msg, 'danger'),
        info: (msg) => add(msg, 'info'),
        warning: (msg) => add(msg, 'warning'),
    }

    const ICONS = { success: '?', danger: '?', info: '??', warning: '??' }

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div
                className="position-fixed bottom-0 end-0 p-3 d-flex flex-column gap-2 z-3"
                role="region"
                aria-label="Notificacions"
                aria-live="polite"
            >
                {toasts.map((t) => (
                    <div key={t.id} className={`alert alert-${t.type} shadow-sm mb-0 d-flex align-items-center gap-2`} role="alert">
                        <span aria-hidden="true">{ICONS[t.type]}</span>
                        <span className="flex-grow-1">{t.message}</span>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => remove(t.id)} aria-label="Tancar">
                            ?
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}


