import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosConfig'
import './TripChat.css'

export default function TripChat({ tripId }) {
    const [messages, setMessages] = useState([])
    const [input,    setInput]    = useState('')
    const [wsStatus, setWsStatus] = useState('connecting')
    const ws        = useRef(null)
    const bottomRef = useRef(null)
    const { token, user } = useAuth()

    useEffect(() => {
        // Historial REST — ruta del teu backend
        api.get(`/trips/${tripId}/chat`)
            .then(res => setMessages(res.data))
            .catch(() => {})

        // WebSocket
        const wsUrl = `ws://localhost:8000/trips/${tripId}/ws?token=${token}`
        ws.current = new WebSocket(wsUrl)
        ws.current.onopen  = () => setWsStatus('open')
        ws.current.onclose = () => setWsStatus('closed')
        ws.current.onerror = () => setWsStatus('closed')
        ws.current.onmessage = (e) => {
            try { setMessages(prev => [...prev, JSON.parse(e.data)]) } catch {}
        }
        return () => ws.current?.close()
    }, [tripId, token])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = () => {
        const text = input.trim()
        if (!text || ws.current?.readyState !== WebSocket.OPEN) return
        // El teu backend accepta "contingut" o "content"
        ws.current.send(JSON.stringify({ contingut: text }))
        setInput('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
    }

    const formatTime = (ts) => {
        if (!ts) return ''
        try { return new Date(ts).toLocaleTimeString('ca', { hour:'2-digit', minute:'2-digit' }) }
        catch { return '' }
    }

    return (
        <div className="tn-chat" role="region" aria-label="Xat del viatge">
            <div className="tn-chat__header">
                <span className="tn-chat__title">💬 Xat del grup</span>
                <span className={`tn-chat__status tn-chat__status--${wsStatus}`}>
          <span className="tn-chat__status-dot" aria-hidden="true" />
                    {wsStatus === 'open' ? 'En línia' : wsStatus === 'connecting' ? 'Connectant...' : 'Desconnectat'}
        </span>
            </div>

            <div className="tn-chat__messages" aria-live="polite" role="log">
                {messages.length === 0 && (
                    <div className="tn-chat__empty">
                        <span>🌊</span>
                        <p>Sigues el primer en escriure!</p>
                    </div>
                )}
                {messages.map((m, i) => {
                    // El teu backend retorna { contingut, autor: { id, full_name }, timestamp }
                    const isMe = m.autor?.id === user?.id
                    const name = m.autor?.full_name || 'Usuari'
                    const text = m.contingut || m.content || ''
                    return (
                        <div key={m.id || i} className={`tn-chat__msg ${isMe ? 'tn-chat__msg--mine' : 'tn-chat__msg--other'}`}>
                            {!isMe && (
                                <div className="tn-chat__author" aria-hidden="true">
                                    {name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="tn-chat__bubble">
                                {!isMe && <span className="tn-chat__bubble-name">{name}</span>}
                                <p className="tn-chat__bubble-text">{text}</p>
                                <time className="tn-chat__bubble-time">{formatTime(m.timestamp)}</time>
                            </div>
                        </div>
                    )
                })}
                <div ref={bottomRef} aria-hidden="true" />
            </div>

            <div className="tn-chat__input-area">
        <textarea
            className="tn-chat__input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={wsStatus === 'open' ? "Escriu un missatge... (Enter per enviar)" : "Connectant al xat..."}
            rows={1}
            disabled={wsStatus !== 'open'}
        />
                <button
                    className="tn-chat__send"
                    onClick={sendMessage}
                    disabled={wsStatus !== 'open' || !input.trim()}
                    aria-label="Enviar"
                >
                    ➤
                </button>
            </div>
        </div>
    )
}