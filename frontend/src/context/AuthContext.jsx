// Contexto de autenticacion: guarda usuario/token y exposa login/logout/loading.
import { useState, useEffect } from 'react'
import AuthContext from './auth-context'
import api from '../api/axiosConfig'

export function AuthProvider({ children }) {
    const [user,    setUser]    = useState(null)
    const [token,   setToken]   = useState(localStorage.getItem('token') || null)
    const [loading, setLoading] = useState(true)  // <-- clau

    // En muntar, si hi ha token, recupera l'usuari actual
    useEffect(() => {
        if (!token) {
            setLoading(false)
            return
        }
        api.get('/users/me')
            .then(res => setUser(res.data))
            .catch(() => {
                // Token invàlid o expirat → neteja
                localStorage.removeItem('token')
                setToken(null)
                setUser(null)
            })
            .finally(() => setLoading(false))
    }, [token])

    const login = (tokenData, userData) => {
        localStorage.setItem('token', tokenData)
        setToken(tokenData)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    const updateUser = (data) => setUser(data)

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}