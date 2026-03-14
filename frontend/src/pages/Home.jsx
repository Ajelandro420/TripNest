// Home publica: presenta la plataforma y llamados a la accion.
import { Link } from 'react-router-dom'
import useAuth from '../context/useAuth'

const FEATURES = [
    {
        icon: '???',
        title: 'Planifica',
        text: 'Crea itineraris detallats, afegeix destins i organitza cada dia del viatge amb el teu grup.',
    },
    {
        icon: '??',
        title: "Comunica't",
        text: 'Xat integrat per a cada viatge. Comparteix idees, dubtes i moments amb tots els participants.',
    },
    {
        icon: '??',
        title: 'Gestiona',
        text: "Control total dels participants, rols i inscripcions. Tu decideixes qui s'uneix a l'aventura.",
    },
]

const STEPS = [
    { n: '01', title: 'Crea el compte', text: "Registra't en 30 segons. Sense complicacions." },
    { n: '02', title: 'Explora viatges', text: 'Descobreix expedicions obertes o crea la teva propia.' },
    { n: '03', title: 'Uneix-te o crea', text: 'Inscriu-te a un viatge o lidera el teu propi grup.' },
    { n: '04', title: "Viu l'aventura", text: 'Coordineu-vos amb el xat i gaudiu de cada moment.' },
]

export default function Home() {
    const { token } = useAuth()

    return (
        <>
            <section className="py-5 bg-light border-bottom" aria-labelledby="hero-title">
                <div className="container py-4">
                    <div className="row justify-content-center text-center">
                        <div className="col-12 col-lg-8">
                            <p className="text-uppercase small text-primary fw-semibold mb-2">La plataforma mediterrania de viatges</p>
                            <h1 id="hero-title" className="display-6 fw-bold mb-3">
                                Viatja en grup, <span className="text-primary">sense complicacions</span>
                            </h1>
                            <p className="lead text-secondary mb-4">
                                TripNest es la manera mes senzilla de planificar, coordinar i viure aventures en grup.
                            </p>
                            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                                {token ? (
                                    <Link to="/dashboard" className="btn btn-primary btn-lg">Explorar viatges</Link>
                                ) : (
                                    <>
                                        <Link to="/register" className="btn btn-primary btn-lg">Comenca ara</Link>
                                        <Link to="/login" className="btn btn-outline-primary btn-lg">Ja tinc compte</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-4 border-bottom" aria-label="Estadistiques de la plataforma">
                <div className="container">
                    <div className="row row-cols-2 row-cols-md-4 g-3 text-center">
                        <div className="col"><div className="p-3 border rounded bg-white"><div className="h4 mb-0">+2.400</div><small className="text-secondary">Viatgers actius</small></div></div>
                        <div className="col"><div className="p-3 border rounded bg-white"><div className="h4 mb-0">+180</div><small className="text-secondary">Viatges creats</small></div></div>
                        <div className="col"><div className="p-3 border rounded bg-white"><div className="h4 mb-0">34</div><small className="text-secondary">Paisos visitats</small></div></div>
                        <div className="col"><div className="p-3 border rounded bg-white"><div className="h4 mb-0">98%</div><small className="text-secondary">Satisfaccio</small></div></div>
                    </div>
                </div>
            </section>

            <section className="py-5" aria-labelledby="features-title">
                <div className="container">
                    <div className="text-center mb-4">
                        <p className="text-uppercase small text-primary fw-semibold mb-2">Per que TripNest</p>
                        <h2 id="features-title" className="h3 mb-2">Tot el que necessites per viatjar en grup</h2>
                        <p className="text-secondary mb-0">Una sola plataforma per organitzar-ho tot, des de la idea fins al record.</p>
                    </div>
                    <div className="row g-3" role="list">
                        {FEATURES.map((f) => (
                            <article key={f.title} className="col-12 col-md-4" role="listitem">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <div className="fs-3 mb-2" aria-hidden="true">{f.icon}</div>
                                        <h3 className="h5">{f.title}</h3>
                                        <p className="text-secondary mb-0">{f.text}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-5 bg-light" aria-labelledby="how-title">
                <div className="container">
                    <div className="text-center mb-4">
                        <p className="text-uppercase small text-primary fw-semibold mb-2">Proces simple</p>
                        <h2 id="how-title" className="h3 mb-0">Com funciona TripNest</h2>
                    </div>
                    <div className="row g-3" role="list" aria-label="Passos per comencar">
                        {STEPS.map((s) => (
                            <div key={s.n} className="col-12 col-md-6 col-lg-3" role="listitem">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <div className="badge text-bg-primary mb-2">{s.n}</div>
                                        <h3 className="h6">{s.title}</h3>
                                        <p className="text-secondary mb-0 small">{s.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-5 border-top" aria-labelledby="cta-title">
                <div className="container text-center">
                    <h2 id="cta-title" className="h3 mb-2">Preparat per a la teva proxima aventura?</h2>
                    <p className="text-secondary mb-4">Uneix-te a milers de viatgers que ja confien en TripNest.</p>
                    {!token && <Link to="/register" className="btn btn-success btn-lg">Crear el meu compte gratis</Link>}
                </div>
            </section>
        </>
    )
}



