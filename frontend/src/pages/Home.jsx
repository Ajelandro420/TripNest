import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Home.css'

const FEATURES = [
    { icon: '🗺️', title: 'Planifica',     text: 'Crea itineraris detallats, afegeix destins i organitza cada dia del viatge amb el teu grup.' },
    { icon: '💬', title: 'Comunica\'t',   text: 'Xat integrat per a cada viatge. Comparteix idees, dubtes i moments amb tots els participants.' },
    { icon: '👥', title: 'Gestiona',      text: 'Control total dels participants, rols i inscripcions. Tu decideixes qui s\'uneix a l\'aventura.' },
]

const STEPS = [
    { n: '01', title: 'Crea el compte',    text: 'Registra\'t en 30 segons. Sense complicacions.' },
    { n: '02', title: 'Explora viatges',   text: 'Descobreix expedicions obertes o crea la teva pròpia.' },
    { n: '03', title: 'Uneix-te o crea',   text: 'Inscriu-te a un viatge o lidera el teu propi grup.' },
    { n: '04', title: 'Viu l\'aventura',   text: 'Coordineu-vos amb el xat i gaudir de cada moment.' },
]

export default function Home() {
    const { token } = useAuth()

    return (
        <>
            {/* ── HERO ── */}
            <section className="tn-hero" aria-labelledby="hero-title">
                <div className="tn-hero__content">
                    <p className="tn-hero__pretitle">La plataforma mediterrània de viatges</p>
                    <h1 id="hero-title" className="tn-hero__title">
                        Viatja en grup,<br />
                        <span>sense complicacions</span>
                    </h1>
                    <p className="tn-hero__subtitle">
                        TripNest és la manera més senzilla de planificar, coordinar i viure aventures en grup. Destins infinits, records per sempre.
                    </p>
                    <div className="tn-hero__actions">
                        {token ? (
                            <Link to="/dashboard" className="tn-hero__cta-primary">
                                🗺️ Explorar viatges
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="tn-hero__cta-primary">
                                    ✨ Comença ara — és gratis
                                </Link>
                                <Link to="/login" className="tn-hero__cta-secondary">
                                    Ja tinc compte
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Scroll hint */}
                <div className="tn-hero__scroll" aria-hidden="true">
                    <span>descobreix</span>
                    <div className="tn-hero__scroll-arrow" />
                </div>
            </section>

            {/* ── STATS ── */}
            <section className="tn-stats" aria-label="Estadístiques de la plataforma">
                <div className="tn-stats__inner">
                    <div className="tn-stats__item">
                        <strong>+2.400</strong><span>Viatgers actius</span>
                    </div>
                    <div className="tn-stats__divider" aria-hidden="true" />
                    <div className="tn-stats__item">
                        <strong>+180</strong><span>Viatges creats</span>
                    </div>
                    <div className="tn-stats__divider" aria-hidden="true" />
                    <div className="tn-stats__item">
                        <strong>34</strong><span>Països visitats</span>
                    </div>
                    <div className="tn-stats__divider" aria-hidden="true" />
                    <div className="tn-stats__item">
                        <strong>98%</strong><span>Satisfacció</span>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="tn-features" aria-labelledby="features-title">
                <div className="tn-container">
                    <header className="tn-features__header">
                        <p className="tn-features__pretitle">Per què TripNest</p>
                        <h2 id="features-title">Tot el que necessites per viatjar en grup</h2>
                        <p>Una sola plataforma per organitzar-ho tot, des de la idea fins al record.</p>
                    </header>

                    <div className="tn-features__grid" role="list">
                        {FEATURES.map((f) => (
                            <article key={f.title} className="tn-feature-card" role="listitem">
                                <div className="tn-feature-card__icon" aria-hidden="true">{f.icon}</div>
                                <h3 className="tn-feature-card__title">{f.title}</h3>
                                <p className="tn-feature-card__text">{f.text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── COM FUNCIONA ── */}
            <section className="tn-how" aria-labelledby="how-title">
                <div className="tn-container">
                    <header className="tn-features__header">
                        <p className="tn-features__pretitle">Procés simple</p>
                        <h2 id="how-title">Com funciona TripNest</h2>
                    </header>

                    <ol className="tn-steps" aria-label="Passos per começar">
                        {STEPS.map((s) => (
                            <li key={s.n} className="tn-step">
                                <div className="tn-step__number" aria-hidden="true">{s.n}</div>
                                <h3 className="tn-step__title">{s.title}</h3>
                                <p className="tn-step__text">{s.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* ── CTA FINAL ── */}
            <section className="tn-cta-section" aria-labelledby="cta-title">
                <div className="tn-cta-section__inner">
                    <h2 id="cta-title">
                        Preparat per a la teva<br /><span>pròxima aventura?</span>
                    </h2>
                    <p>Uneix-te a milers de viatgers que ja confien en TripNest per organitzar les seves escapades.</p>
                    {!token && (
                        <Link to="/register" className="tn-hero__cta-primary">
                            🚀 Crear el meu compte gratis
                        </Link>
                    )}
                </div>
            </section>
        </>
    )
}