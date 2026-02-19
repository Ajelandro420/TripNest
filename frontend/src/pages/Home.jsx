import "./Home.css";

function Home() {
    return (
        <div className="home">
            <section className="hero">
                <h1>Descubre el mundo con Tripnest</h1>
                <p>Viajes únicos inspirados en el mar y la montaña</p>
                <button className="cta">Explorar destinos</button>
            </section>

            <section className="features">
                <div className="card">
                    <h3>🌊 Destinos Mediterráneos</h3>
                    <p>Playas cristalinas y cultura histórica.</p>
                </div>

                <div className="card">
                    <h3>⛰️ Aventuras de Montaña</h3>
                    <p>Experiencias únicas en entornos naturales.</p>
                </div>

                <div className="card">
                    <h3>✈️ Experiencias Premium</h3>
                    <p>Organización profesional y personalizada.</p>
                </div>
            </section>
        </div>
    );
}

export default Home;
