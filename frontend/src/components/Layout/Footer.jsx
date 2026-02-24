import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="tn-footer" role="contentinfo">
            <div className="tn-footer__inner">
                <div className="tn-footer__top">

                    {/* Brand */}
                    <div className="tn-footer__brand-col">
                        <div className="tn-footer__brand" aria-label="TripNest">
                            <span aria-hidden="true">🪺</span>
                            <span className="tn-footer__brand-name">Trip<span>Nest</span></span>
                        </div>
                        <p className="tn-footer__tagline">
                            Planifica, comparteix i viu aventures en grup. La plataforma mediterrània per als amants dels viatges.
                        </p>
                    </div>

                    {/* Plataforma */}
                    <div className="tn-footer__col">
                        <h3 className="tn-footer__col-title">Plataforma</h3>
                        <ul className="tn-footer__links" aria-label="Enllaços de plataforma">
                            <li><Link to="/dashboard">🗺️ Explorar viatges</Link></li>
                            <li><Link to="/register">✨ Crear compte</Link></li>
                            <li><Link to="/login">🔑 Iniciar sessió</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="tn-footer__col">
                        <h3 className="tn-footer__col-title">Legal</h3>
                        <ul className="tn-footer__links" aria-label="Enllaços legals">
                            <li><a href="/privacy">🔒 Privacitat</a></li>
                            <li><a href="/terms">📄 Termes d'ús</a></li>
                            <li><a href="/cookies">🍪 Política de cookies</a></li>
                            <li><a href="/accessibility">♿ Accessibilitat</a></li>
                        </ul>
                    </div>
                </div>

                <div className="tn-footer__bottom">
                    <p className="tn-footer__copyright">
                        © {year} TripNest. Fet amb 🌊 i ☀️ a la Mediterrània.
                    </p>
                    <p className="tn-footer__wcag">
                        <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer" aria-label="Conformitat WCAG 2.1 AA (s'obre en pestanya nova)">
                            ♿ WCAG 2.1 AA
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}