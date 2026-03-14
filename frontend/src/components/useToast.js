// Hook sencillo para lanzar mensajes tipo success/error/info.
import { useContext } from 'react'
import ToastContext from './toast-context'

export default function useToast() {
    return useContext(ToastContext)
}


