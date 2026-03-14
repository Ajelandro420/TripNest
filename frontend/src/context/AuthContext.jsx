// Contexto de autenticacion: guarda usuario/token y expone login/logout.
import { useState } from 'react'
import AuthContext from './auth-context'

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token') || null)

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
        <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}


