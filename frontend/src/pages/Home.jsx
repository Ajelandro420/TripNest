// Home publica: presenta la plataforma y llamados a la accion.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../context/useAuth'
import api from '../api/axiosConfig'

const FEATURES = [
    {
        title: 'Planifica',
        text: 'Crea itineraris detallats, afegeix destins i organitza cada dia del viatge amb el teu grup.',
    },
    {
        title: "Comunica't",
        text: 'Xat integrat per a cada viatge. Comparteix idees, dubtes i moments amb tots els participants.',
    },
    {
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

function formatStat(value) {
    return new Intl.NumberFormat('es-ES').format(value)
}

export default function Home() {
    const { token } = useAuth()
    const [stats, setStats] = useState({ travelers_active: 0, trips_created: 0, countries_visited: 0 })

    useEffect(() => {
        let active = true

        api.get('/trips/public-stats')
            .then((res) => {
                if (!active) return
                setStats({
                    travelers_active: Number(res.data?.travelers_active || 0),
                    trips_created: Number(res.data?.trips_created || 0),
                    countries_visited: Number(res.data?.countries_visited || 0),
                })
            })
            .catch(() => {
                if (!active) return
                setStats({ travelers_active: 0, trips_created: 0, countries_visited: 0 })
            })

        return () => {
            active = false
        }
    }, [])

    return (
        <>
            <section className="position-relative overflow-hidden border-bottom" aria-labelledby="hero-title">
                <img
                    src="https://picsum.photos/seed/tripnest-hero/1600/900"
                    alt="Paisatge natural"
                    className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50" aria-hidden="true" />

                <div className="container py-5 position-relative text-white">
                    <div className="row justify-content-center text-center">
                        <div className="col-12 col-lg-8">
                            <p className="text-uppercase small text-warning fw-semibold mb-2">La plataforma mediterrania de viatges</p>
                            <h1 id="hero-title" className="display-5 fw-bold mb-3">
                                Viatja en grup, <span className="text-warning">sense complicacions</span>
                            </h1>
                            <p className="lead mb-4">
                                TripNest es la manera mes senzilla de planificar, coordinar i viure aventures en grup.
                            </p>
                            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                                {token ? (
                                    <Link to="/dashboard" className="btn btn-warning btn-lg text-dark">Explorar viatges</Link>
                                ) : (
                                    <>
                                        <Link to="/register" className="btn btn-success btn-lg">Comenca ara</Link>
                                        <Link to="/login" className="btn btn-outline-light btn-lg">Ja tinc compte</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-4 border-bottom border-warning-subtle bg-warning-subtle" aria-label="Estadistiques de la plataforma">
                <div className="container">
                    <div className="row row-cols-1 row-cols-md-3 g-3 text-center">
                        <div className="col">
                            <div className="p-3 border border-warning-subtle rounded bg-white">
                                <div className="h4 mb-0">{formatStat(stats.travelers_active)}</div>
                                <small className="text-secondary">Viatgers actius</small>
                            </div>
                        </div>
                        <div className="col">
                            <div className="p-3 border border-warning-subtle rounded bg-white">
                                <div className="h4 mb-0">{formatStat(stats.trips_created)}</div>
                                <small className="text-secondary">Viatges creats</small>
                            </div>
                        </div>
                        <div className="col">
                            <div className="p-3 border border-warning-subtle rounded bg-white">
                                <div className="h4 mb-0">{formatStat(stats.countries_visited)}</div>
                                <small className="text-secondary">Paisos visitats</small>
                            </div>
                        </div>
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
                                        <h3 className="h5">{f.title}</h3>
                                        <p className="text-secondary mb-0">{f.text}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-5 bg-info-subtle" aria-labelledby="how-title">
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
