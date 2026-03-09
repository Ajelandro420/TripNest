/**
 * TripChat
 *
 * Componente de React que implementa un chat de grupo para un viaje.
 *
 * Propiedades:
 * @param {object} props
 * @param {string|number} props.tripId - Identificador del viaje cuyo chat se debe mostrar.
 *
 * Comportamiento principal:
 * - Carga el historial de mensajes mediante una llamada REST a `/trips/:tripId/chat`.
 * - Abre un WebSocket en `ws://localhost:8000/trips/:tripId/ws?token=...` para recibir
 *   mensajes en tiempo real (requiere un token válido proporcionado por `useAuth`).
 * - Mantiene el estado local de mensajes y del input, y maneja el envío de mensajes
 *   a través del WebSocket.
 * - Controla el estado de la conexión (`connecting`, `open`, `closed`) y muestra
 *   indicadores accesibles en la UI.
 *
 * Notas sobre seguridad y configuración:
 * - El WebSocket se crea con un token en la query string; asegúrate de que el backend
 *   valide el token y use TLS/WSS en producción (aquí se usa `ws://localhost:8000` solo
 *   para desarrollo local).
 * - Se asume que el backend acepta mensajes con clave `contingut` (o `content`) y que
 *   cada mensaje puede tener la forma:
 *   { id?, contingut?: string, content?: string, autor?: { id, full_name }, timestamp?: string }
 * - `ProtectedRoute`/context debe proporcionar `token` y `user` vía `useAuth`.
 */

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosConfig'
import './TripChat.css'

export default function TripChat({ tripId }) {
    // Estado local
    const [messages, setMessages] = useState([]) // Lista de mensajes
    const [input,    setInput]    = useState('') // Contenido del textarea
    const [wsStatus, setWsStatus] = useState('connecting') // Estado: connecting | open | closed

    // Referencias
    const ws        = useRef(null) // Referencia al WebSocket
    const bottomRef = useRef(null) // Referencia para hacer scroll al último mensaje

    // Auth
    const { token, user } = useAuth()

    // Efecto: cargar historial via REST y abrir WebSocket
    useEffect(() => {
        // Carga inicial del historial de mensajes desde el backend (REST)
        api.get(`/trips/${tripId}/chat`)
            .then(res => setMessages(res.data))
            .catch(() => {
                // Error silencioso: se puede mejorar mostrando un aviso al usuario
            })

        // Construcción de la URL del WebSocket. En producción usa wss:// y el host real.
        const wsUrl = `ws://localhost:8000/trips/${tripId}/ws?token=${token}`
        ws.current = new WebSocket(wsUrl)

        // Manejo del estado de la conexión
        ws.current.onopen  = () => setWsStatus('open')
        ws.current.onclose = () => setWsStatus('closed')
        ws.current.onerror = () => setWsStatus('closed')

        // Recepción de mensajes entrantes: se intenta parsear como JSON y añadir al array
        ws.current.onmessage = (e) => {
            try { setMessages(prev => [...prev, JSON.parse(e.data)]) } catch {}
        }

        // Cleanup: cerrar WebSocket cuando el componente se desmonte o cambie tripId/token
        return () => ws.current?.close()
    }, [tripId, token]) // Dependencias: reabrir socket si cambia el viaje o el token

    // Efecto: hacer scroll al último mensaje cuando cambian los mensajes
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    /**
     * Enviar mensaje por WebSocket
     * - Hace trim al input y evita enviar si está vacío o si el socket no está abierto.
     * - Envía un objeto JSON; aquí usamos la clave `contingut` (valores alternativos: `content`).
     */
    const sendMessage = () => {
        const text = input.trim()
        if (!text || ws.current?.readyState !== WebSocket.OPEN) return
        // El backend puede aceptar `contingut` o `content` según su API
        ws.current.send(JSON.stringify({ contingut: text }))
        setInput('')
    }

    /**
     * handleKeyDown
     * - Enviar con Enter (sin Shift). Shift+Enter permite salto de línea.
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
    }

    /**
     * formatTime
     * - Formatea una marca temporal (`timestamp`) a hora y minuto según la localización.
     * - Devuelve cadena vacía si no hay timestamp o falla el parseo.
     */
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
                    {/* Texto accesible que refleja el estado del WebSocket */}
                    {wsStatus === 'open' ? 'En línia' : wsStatus === 'connecting' ? 'Connectant...' : 'Desconnectat'}
                </span>
            </div>

            {/* Contenedor de mensajes.
                - aria-live="polite" para que lectores de pantalla anuncien nuevos mensajes con cortesía.
                - role="log" para indicar registro de eventos/actividad en tiempo real. */}
            <div className="tn-chat__messages" aria-live="polite" role="log">
                {messages.length === 0 && (
                    <div className="tn-chat__empty">
                        <span>🌊</span>
                        <p>Sigues el primer en escriure!</p>
                    </div>
                )}

                {messages.map((m, i) => {
                    // Se espera que cada mensaje tenga al menos: { contingut, autor: { id, full_name }, timestamp }
                    const isMe = m.autor?.id === user?.id
                    const name = m.autor?.full_name || 'Usuari'
                    const text = m.contingut || m.content || ''
                    return (
                        <div key={m.id || i} className={`tn-chat__msg ${isMe ? 'tn-chat__msg--mine' : 'tn-chat__msg--other'}`}>
                            {!isMe && (
                                // Avatar/Inicial del autor (decorativo)
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

                {/* Elemento para hacer scroll hacia abajo */}
                <div ref={bottomRef} aria-hidden="true" />
            </div>

            {/* Área de entrada y envío de mensajes */}
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