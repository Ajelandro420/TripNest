// Config de Axios: URL base y ajustes comunes para llamadas al backend.
// src/api/axiosConfig.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000',
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default api

