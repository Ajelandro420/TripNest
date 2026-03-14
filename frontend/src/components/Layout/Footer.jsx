// Pie de pagina con enlaces de plataforma y bloque legal.
import { Link } from 'react-router-dom'

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="bg-primary text-light mt-auto" role="contentinfo">
            <div className="container py-5">
                <div className="row g-4">
                    <div className="col-12 col-lg-5">
                        <div className="d-flex align-items-center gap-2 mb-2 fw-bold fs-4">
                            <span aria-hidden="true">??</span>
                            <span>Trip<span className="text-info">Nest</span></span>
                        </div>
                        <p className="mb-0 text-light-emphasis">
                            Planifica, comparteix i viu aventures en grup. La plataforma mediterrania per als amants dels viatges.
                        </p>
                    </div>

                    <div className="col-6 col-lg-3">
                        <h3 className="h6 text-uppercase small text-light-emphasis">Plataforma</h3>
                        <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                            <li><Link to="/dashboard" className="link-light link-opacity-75-hover">Explorar viatges</Link></li>
                            <li><Link to="/register" className="link-light link-opacity-75-hover">Crear compte</Link></li>
                            <li><Link to="/login" className="link-light link-opacity-75-hover">Iniciar sessio</Link></li>
                        </ul>
                    </div>

                    <div className="col-6 col-lg-4">
                        <h3 className="h6 text-uppercase small text-light-emphasis">Legal</h3>
                        <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                            <li><a href="/privacy" className="link-light link-opacity-75-hover">Privacitat</a></li>
                            <li><a href="/terms" className="link-light link-opacity-75-hover">Termes d'us</a></li>
                            <li><a href="/cookies" className="link-light link-opacity-75-hover">Politica de cookies</a></li>
                            <li><a href="/accessibility" className="link-light link-opacity-75-hover">Accessibilitat</a></li>
                        </ul>
                    </div>
                </div>

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 border-top border-light border-opacity-25 mt-4 pt-3">
                    <p className="mb-0 small text-light-emphasis">© {year} TripNest. Fet amb mar i sol a la Mediterrania.</p>
                    <a
                        href="https://www.w3.org/WAI/WCAG21/quickref/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="small link-light"
                        aria-label="Conformitat WCAG 2.1 AA"
                    >
                        WCAG 2.1 AA
                    </a>
                </div>
            </div>
        </footer>
    )
}

