// 404 simple con botones para volver o ir al dashboard.
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <main className="container min-vh-100 py-5 text-center d-flex flex-column justify-content-center">            <h1 className="display-3 fw-bold mb-2">404</h1>
            <h2 className="h4 text-secondary mb-3">Pagina no trobada</h2>
            <p className="text-secondary w-75 mx-auto mb-4">
                Sembla que t'has perdut en alta mar. Aquesta pagina no existeix o ha estat eliminada.
            </p>
            <div className="d-flex gap-2 flex-wrap justify-content-center">
                <button type="button" className="btn btn-outline-primary" onClick={() => navigate(-1)}>
                    Enrere
                </button>
                <button type="button" className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                    Anar als viatges
                </button>
            </div>
        </main>
    )
}




