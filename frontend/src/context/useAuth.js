// Hook comodo para leer auth en cualquier componente.
import { useContext } from 'react'
import AuthContext from './auth-context'

export default function useAuth() {
    return useContext(AuthContext)
}


