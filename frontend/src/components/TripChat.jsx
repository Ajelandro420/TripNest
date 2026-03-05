import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axiosConfig'
import './TripChat.css'

export default function TripChat({ tripId }) {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [wsStatus, setWsStatus] = useState('connecting') // connecting | open | closed
    const ws = useRef(null)
    const bottomRef = useRef(null)
    const { token, user } = useAuth()

    const normalizeMessage = (raw) => ({
        id: raw?.id,
        contingut: raw?.contingut ?? raw?.content ?? '',
        timestamp: raw?.timestamp,
        autor: raw?.autor ?? {
            id: raw?.user_id,
            full_name: raw?.user_name ?? raw?.autor,
        },
    })

    // Carrega missatges anteriors + connecta WS
    useEffect(() => {
        // 1. Missatges antics (REST)
        api.get(`/trips/${tripId}/chat`)
            .then((res) => setMessages((res.data || []).map(normalizeMessage)))
            .catch(() => {})

        // 2. WebSocket
        const wsUrl = `ws://localhost:8000/ws/trips/${tripId}/chat?token=${token}`
        ws.current = new WebSocket(wsUrl)

        ws.current.onopen = () => setWsStatus('open')
        ws.current.onclose = () => setWsStatus('closed')
        ws.current.onerror = () => setWsStatus('closed')

        ws.current.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data)
                setMessages((prev) => [...prev, normalizeMessage(msg)])
            } catch {}
        }

        return () => ws.current?.close()
    }, [tripId, token])

    // Auto-scroll al final
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = () => {
        const text = input.trim()
        if (!text || ws.current?.readyState !== WebSocket.OPEN) return
        ws.current.send(JSON.stringify({ contingut: text, content: text }))
        setInput('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const formatTime = (ts) => {
        if (!ts) return ''
        try {
            return new Date(ts).toLocaleTimeString('ca', { hour: '2-digit', minute: '2-digit' })
        } catch {
            return ''
        }
    }

    return (
        <div className="tn-chat" role="region" aria-label="Xat del viatge">
            <div className="tn-chat__header">
                <span className="tn-chat__title">Chat del grup</span>
                <span
                    className={`tn-chat__status tn-chat__status--${wsStatus}`}
                    aria-label={`Connexio: ${wsStatus === 'open' ? 'connectat' : wsStatus === 'connecting' ? 'connectant' : 'desconnectat'}`}
                >
                    <span className="tn-chat__status-dot" aria-hidden="true" />
                    {wsStatus === 'open' ? 'En linia' : wsStatus === 'connecting' ? 'Connectant...' : 'Desconnectat'}
                </span>
            </div>

            <div className="tn-chat__messages" aria-live="polite" aria-label="Missatges del xat" role="log" aria-atomic="false">
                {messages.length === 0 && (
                    <div className="tn-chat__empty">
                        <p>Sigues el primer en escriure!</p>
                    </div>
                )}

                {messages.map((m, i) => {
                    const isMe = m.autor?.id === user?.id || m.autor === user?.full_name
                    return (
                        <div
                            key={m.id ?? i}
                            className={`tn-chat__msg ${isMe ? 'tn-chat__msg--mine' : 'tn-chat__msg--other'}`}
                            aria-label={`Missatge de ${isMe ? 'tu' : (m.autor?.full_name || m.autor || 'usuari')}`}
                        >
                            {!isMe && (
                                <div className="tn-chat__author" aria-hidden="true">
                                    {m.autor?.full_name?.charAt(0) || '?'}
                                </div>
                            )}
                            <div className="tn-chat__bubble">
                                {!isMe && <span className="tn-chat__bubble-name">{m.autor?.full_name || m.autor}</span>}
                                <p className="tn-chat__bubble-text">{m.contingut}</p>
                                <time className="tn-chat__bubble-time" dateTime={m.timestamp}>
                                    {formatTime(m.timestamp)}
                                </time>
                            </div>
                        </div>
                    )
                })}

                <div ref={bottomRef} aria-hidden="true" />
            </div>

            <div className="tn-chat__input-area" role="group" aria-label="Escriure missatge">
                <textarea
                    className="tn-chat__input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escriu un missatge... (Enter per enviar)"
                    rows={1}
                    aria-label="Camp de text per escriure missatge"
                    disabled={wsStatus !== 'open'}
                />
                <button
                    className="tn-chat__send"
                    onClick={sendMessage}
                    disabled={wsStatus !== 'open' || !input.trim()}
                    aria-label="Enviar missatge"
                >
                    Send
                </button>
            </div>
        </div>
    )
}
