import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../public/context/AuthContext.jsx'
import api         from '../api/axiosConfig'

export default function TripChat({ tripId }) {
    const [messages, setMessages] = useState([])
    const [input,    setInput]    = useState('')
    const [wsStatus, setWsStatus] = useState('connecting') // connecting | open | closed
    const ws      = useRef(null)
    const bottomRef = useRef(null)
    const { token, user } = useAuth()

    // Carrega missatges anteriors + connecta WS
    useEffect(() => {
        // 1. Missatges antics (REST)
        api.get(`/trips/${tripId}/chat`)
            .then(res => setMessages(res.data))
            .catch(() => {})

        // 2. WebSocket
        const wsUrl = `ws://localhost:8000/ws/trips/${tripId}/chat?token=${token}`
        ws.current = new WebSocket(wsUrl)

        ws.current.onopen  = () => setWsStatus('open')
        ws.current.onclose = () => setWsStatus('closed')
        ws.current.onerror = () => setWsStatus('closed')

        ws.current.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data)
                setMessages(prev => [...prev, msg])
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
            {/* Header */}
            <div className="tn-chat__header">
                <span className="tn-chat__title">💬 Xat del grup</span>
                <span className={`tn-chat__status tn-chat__status--${wsStatus}`}
                      aria-label={`Connexió: ${wsStatus === 'open' ? 'connectat' : wsStatus === 'connecting' ? 'connectant' : 'desconnectat'}`}>
          <span className="tn-chat__status-dot" aria-hidden="true" />
                    {wsStatus === 'open' ? 'En línia' : wsStatus === 'connecting' ? 'Connectant...' : 'Desconnectat'}
        </span>
            </div>

            {/* Zona de missatges */}
            <div
                className="tn-chat__messages"
                aria-live="polite"
                aria-label="Missatges del xat"
                role="log"
                aria-atomic="false"
            >
                {messages.length === 0 && (
                    <div className="tn-chat__empty">
                        <span aria-hidden="true">🌊</span>
                        <p>Sigues el primer en escriure!</p>
                    </div>
                )}

                {messages.map((m, i) => {
                    const isMe = m.autor?.id === user?.id || m.autor === user?.full_name
                    return (
                        <div key={i}
                             className={`tn-chat__msg ${isMe ? 'tn-chat__msg--mine' : 'tn-chat__msg--other'}`}
                             aria-label={`Missatge de ${isMe ? 'tu' : (m.autor?.full_name || m.autor)}`}
                        >
                            {!isMe && (
                                <div className="tn-chat__author" aria-hidden="true">
                                    {m.autor?.full_name?.charAt(0) || '?'}
                                </div>
                            )}
                            <div className="tn-chat__bubble">
                                {!isMe && (
                                    <span className="tn-chat__bubble-name">{m.autor?.full_name || m.autor}</span>
                                )}
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

            {/* Input */}
            <div className="tn-chat__input-area" role="group" aria-label="Escriure missatge">
        <textarea
            className="tn-chat__input"
            value={input}
            onChange={e => setInput(e.target.value)}
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
                    ➤
                </button>
            </div>

            <style>{chatStyles}</style>
        </div>
    )
}

const chatStyles = `
.tn-chat {
  background: #fff;
  border-radius: var(--tn-r-lg);
  box-shadow: var(--tn-shadow-md);
  border: 1px solid var(--tn-border);
  display: flex;
  flex-direction: column;
  height: 480px;
  overflow: hidden;
}

.tn-chat__header {
  background: var(--tn-gradient-mar);
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.tn-chat__title {
  font-family: var(--tn-font-display);
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
}

.tn-chat__status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--tn-font-body);
  font-size: 0.73rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.tn-chat__status--open    { color: #48C9B0; }
.tn-chat__status--connecting { color: rgba(255,255,255,0.6); }
.tn-chat__status--closed  { color: rgba(231,76,60,0.8); }

.tn-chat__status-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: currentColor;
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%,100% { opacity:1; } 50% { opacity:0.4; }
}

.tn-chat__messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-behavior: smooth;
}

.tn-chat__messages::-webkit-scrollbar { width: 4px; }
.tn-chat__messages::-webkit-scrollbar-track { background: transparent; }
.tn-chat__messages::-webkit-scrollbar-thumb { background: rgba(26,82,118,0.2); border-radius: 2px; }

.tn-chat__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 8px;
  color: var(--tn-text-muted);
  font-size: 0.9rem;
  padding: 40px;
  text-align: center;
}
.tn-chat__empty span { font-size: 2rem; }
.tn-chat__empty p    { margin: 0; }

.tn-chat__msg {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  max-width: 85%;
}

.tn-chat__msg--mine  { align-self: flex-end; flex-direction: row-reverse; }
.tn-chat__msg--other { align-self: flex-start; }

.tn-chat__author {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg,#0D2B45,#17A589);
  color: #fff;
  font-family: var(--tn-font-display);
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tn-chat__bubble {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tn-chat__msg--mine .tn-chat__bubble {
  align-items: flex-end;
}

.tn-chat__bubble-name {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--tn-mar-mig);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.tn-chat__bubble-text {
  font-family: var(--tn-font-body);
  font-size: 0.88rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  padding: 9px 13px;
  border-radius: 14px;
  word-break: break-word;
  color: var(--tn-text);
}

.tn-chat__msg--other .tn-chat__bubble-text {
  background: rgba(235,245,251,0.9);
  border-bottom-left-radius: 4px;
}

.tn-chat__msg--mine .tn-chat__bubble-text {
  background: linear-gradient(135deg,#17A589,#48C9B0);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.tn-chat__bubble-time {
  font-size: 0.65rem;
  color: var(--tn-text-muted);
  padding: 0 4px;
}

.tn-chat__input-area {
  display: flex;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid var(--tn-border);
  background: #fafcff;
  flex-shrink: 0;
}

.tn-chat__input {
  flex: 1;
  font-family: var(--tn-font-body);
  font-size: 0.88rem;
  color: var(--tn-text);
  background: #fff;
  border: 2px solid var(--tn-border);
  border-radius: 20px;
  padding: 10px 16px;
  resize: none;
  outline: none;
  transition: border-color var(--tn-t-fast), box-shadow var(--tn-t-fast);
  line-height: 1.4;
}

.tn-chat__input:focus {
  border-color: var(--tn-turquesa);
  box-shadow: 0 0 0 3px rgba(23,165,137,0.12);
}

.tn-chat__input:disabled { opacity: 0.5; cursor: not-allowed; }

.tn-chat__send {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--tn-gradient-mar);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--tn-t-smooth);
  flex-shrink: 0;
  align-self: flex-end;
}

.tn-chat__send:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: var(--tn-glow);
}

.tn-chat__send:disabled { opacity: 0.4; cursor: not-allowed; }
`