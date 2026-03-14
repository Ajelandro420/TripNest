// Info extra del destino: fotos, meteo, mapa y recomendaciones.
import { useEffect, useRef, useState } from 'react'

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY

const MOCK_ATTRACTIONS = [
    { name: 'Centre Historic', type: 'Monument' },
    { name: 'Mercat Local', type: 'Mercat' },
    { name: 'Mirador Principal', type: 'Natura' },
]

const MOCK_RESTAURANTS = [
    { name: 'La Taula Local', cuisine: 'Cuina tradicional' },
    { name: 'Cafe del Mercat', cuisine: 'Cafeteria' },
    { name: 'El Raco del Port', cuisine: 'Marisc' },
]

const MOCK_HOTELS = [
    { name: 'Hotel Central', stars: '4 estrelles' },
    { name: 'Hostal del Viatger', stars: '3 estrelles' },
    { name: 'Apart. Vista Mar', stars: '5 estrelles' },
]

async function geocode(destination) {
    const city = destination.split(',')[0].trim()
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'ca,es' } },
    )
    const data = await res.json()
    if (data.length === 0) return null
    return { lat: Number(data[0].lat), lon: Number(data[0].lon), name: data[0].display_name }
}

async function fetchPhotos(destination) {
    if (!UNSPLASH_KEY) return []
    const city = destination.split(',')[0].trim()
    const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&per_page=5&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } },
    )
    const data = await res.json()
    return data.results || []
}

async function fetchWeather(city) {
    try {
        const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`)
        const data = await res.json()
        const cur = data.current_condition?.[0]
        if (!cur) return null
        return {
            temp: cur.temp_C,
            desc: cur.weatherDesc?.[0]?.value || '',
            humidity: cur.humidity,
            wind: cur.windspeedKmph,
        }
    } catch {
        return null
    }
}

function LeafletMap({ lat, lon, name }) {
    const mapRef = useRef(null)
    const mapObj = useRef(null)

    useEffect(() => {
        if (!mapRef.current || mapObj.current) return

        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)

        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => {
            const L = window.L
            mapObj.current = L.map(mapRef.current).setView([lat, lon], 13)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',
            }).addTo(mapObj.current)
            L.marker([lat, lon]).addTo(mapObj.current).bindPopup(`<b>${name.split(',')[0]}</b>`).openPopup()
        }
        document.head.appendChild(script)

        return () => {
            mapObj.current?.remove()
            mapObj.current = null
        }
    }, [lat, lon, name])

    return <div ref={mapRef} className="w-100 h-100" aria-label={`Mapa de ${name}`} />
}

function InfoCard({ title, items }) {
    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
                <h3 className="h6 text-uppercase text-secondary mb-3">{title}</h3>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                    {items.map((item) => (
                        <li key={item.name} className="small">
                            <strong>{item.name}</strong>
                            <br />
                            <span className="text-secondary">{item.type || item.cuisine || item.stars}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default function DestinationInfo({ destination }) {
    const [photos, setPhotos] = useState([])
    const [weather, setWeather] = useState(null)
    const [coords, setCoords] = useState(null)

    const city = destination?.split(',')[0]?.trim()

    useEffect(() => {
        if (!destination || !city) return

        let active = true

        Promise.all([fetchPhotos(destination), fetchWeather(city), geocode(destination)]).then(([p, w, c]) => {
            if (!active) return
            setPhotos(p)
            setWeather(w)
            setCoords(c)
        })

        return () => {
            active = false
        }
    }, [city, destination])

    if (!destination) return null

    return (
        <section className="mt-4" aria-label="Informacio del desti">
            {photos.length > 0 && (
                <div className="row g-2 mb-3" role="img" aria-label={`Fotos de ${city}`}>
                    {photos.slice(0, 5).map((p) => (
                        <div key={p.id} className="col-6 col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <img src={p.urls.regular} alt={p.alt_description || city} className="card-img-top" loading="lazy" />
                                <div className="card-body p-2">
                                    <a
                                        href={`${p.user.links.html}?utm_source=tripnest&utm_medium=referral`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="small text-decoration-none"
                                    >
                                        Autor: {p.user.name} · Unsplash
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {weather && (
                <div className="alert alert-info d-flex flex-wrap align-items-center gap-3 mb-3" role="status">
                    <div>
                        <strong>{weather.temp}°C</strong> · {weather.desc}
                    </div>
                    <div className="small text-secondary">Humitat: {weather.humidity}% · Vent: {weather.wind} km/h</div>
                    <div className="small ms-md-auto text-secondary">Temps actual a {city}</div>
                </div>
            )}

            {coords && (
                <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body p-0 ratio ratio-16x9">
                        <LeafletMap lat={coords.lat} lon={coords.lon} name={city} />
                    </div>
                </div>
            )}

            <div className="row g-3">
                <div className="col-12 col-md-4"><InfoCard title="Atraccions" items={MOCK_ATTRACTIONS} /></div>
                <div className="col-12 col-md-4"><InfoCard title="Restaurants" items={MOCK_RESTAURANTS} /></div>
                <div className="col-12 col-md-4"><InfoCard title="Allotjament" items={MOCK_HOTELS} /></div>
            </div>
        </section>
    )
}

