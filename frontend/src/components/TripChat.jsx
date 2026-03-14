// Chat del viaje: pinta mensajes y envia nuevos.
import { useEffect, useRef, useState } from 'react'
import useAuth from '../context/useAuth'
import api from '../api/axiosConfig'

export default function TripChat({ tripId }) {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [wsStatus, setWsStatus] = useState('connecting')

    const ws = useRef(null)
    const bottomRef = useRef(null)
    const { token, user } = useAuth()

    useEffect(() => {
        if (!token) return undefined

        api.get(`/trips/${tripId}/chat`)
            .then((res) => setMessages(res.data))
            .catch(() => setMessages([]))

        const timer = setTimeout(() => {
            const base = api.defaults.baseURL || 'http://localhost:8000'
            const wsBase = base.replace(/^http/, 'ws')
            const wsUrl = `${wsBase}/trips/${tripId}/ws?token=${encodeURIComponent(token)}`

            ws.current = new WebSocket(wsUrl)
            setWsStatus('connecting')

            ws.current.onopen = () => setWsStatus('open')
            ws.current.onclose = () => setWsStatus('closed')
            ws.current.onerror = () => setWsStatus('closed')

            ws.current.onmessage = (e) => {
                try {
                    setMessages((prev) => [...prev, JSON.parse(e.data)])
                } catch {
                    // Ignore malformed websocket payloads.
                }
            }
        }, 120)

        return () => {
            clearTimeout(timer)
            if (ws.current && ws.current.readyState <= WebSocket.OPEN) {
                ws.current.close()
            }
        }
    }, [tripId, token])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = () => {
        const text = input.trim()
        if (!text || ws.current?.readyState !== WebSocket.OPEN) return
        ws.current.send(JSON.stringify({ contingut: text }))
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
        <div className="card border-0 shadow-sm h-100" role="region" aria-label="Xat del viatge">
            <div className="card-header d-flex justify-content-between align-items-center">
                <strong>Xat del grup</strong>
                <span className={`badge ${wsStatus === 'open' ? 'text-bg-success' : wsStatus === 'connecting' ? 'text-bg-secondary' : 'text-bg-danger'}`}>
                    {wsStatus === 'open' ? 'En linia' : wsStatus === 'connecting' ? 'Connectant' : 'Desconnectat'}
                </span>
            </div>

            <div className="card-body overflow-auto" aria-live="polite" role="log">
                {messages.length === 0 && (
                    <p className="text-secondary small mb-0">Sigues el primer en escriure.</p>
                )}

                <div className="d-flex flex-column gap-2">
                    {messages.map((m, i) => {
                        const isMe = m.autor?.id === user?.id
                        const name = m.autor?.full_name || 'Usuari'
                        const text = m.contingut || m.content || ''
                        return (
                            <div key={m.id || i} className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div className={`p-2 rounded w-75 ${isMe ? 'bg-primary text-white' : 'bg-light'}`}>
                                    {!isMe && <div className="small fw-semibold mb-1">{name}</div>}
                                    <p className="mb-1 small">{text}</p>
                                    <div className={`small ${isMe ? 'text-white-50' : 'text-secondary'}`}>{formatTime(m.timestamp)}</div>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={bottomRef} aria-hidden="true" />
                </div>
            </div>

            <div className="card-footer">
                <div className="input-group">
                    <textarea
                        className="form-control"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={wsStatus === 'open' ? 'Escriu un missatge...' : 'Connectant al xat...'}
                        rows={1}
                        disabled={wsStatus !== 'open'}
                    />
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={sendMessage}
                        disabled={wsStatus !== 'open' || !input.trim()}
                        aria-label="Enviar"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    )
}

