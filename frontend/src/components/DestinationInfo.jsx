import { useEffect, useState, useRef } from 'react'
import './DestinationInfo.css'

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY

// Atraccions mock per destí (fallback si no hi ha API)
const MOCK_ATTRACTIONS = {
    default: [
        { name:'Centre Històric',   type:'Monument',   icon:'🏛️' },
        { name:'Mercat Local',      type:'Mercat',      icon:'🛒' },
        { name:'Mirador Principal', type:'Natura',      icon:'🌄' },
    ]
}

const MOCK_RESTAURANTS = [
    { name:'La Taula Local',    cuisine:'Cuina tradicional', icon:'🍽️' },
    { name:'Café del Mercat',   cuisine:'Cafeteria',         icon:'☕' },
    { name:'El Racó del Port',  cuisine:'Marisc',            icon:'🦞' },
]

const MOCK_HOTELS = [
    { name:'Hotel Central',    stars:'⭐⭐⭐⭐', icon:'🏨' },
    { name:'Hostal del Viatger', stars:'⭐⭐⭐',  icon:'🛏️' },
    { name:'Apart. Vista Mar',  stars:'⭐⭐⭐⭐⭐', icon:'🏢' },
]

// Geocodifica el destí amb Nominatim (OpenStreetMap, gratuït)
async function geocode(destination) {
    const city = destination.split(',')[0].trim()
    const res  = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'ca,es' } }
    )
    const data = await res.json()
    if (data.length === 0) return null
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), name: data[0].display_name }
}

// Fotos Unsplash
async function fetchPhotos(destination) {
    if (!UNSPLASH_KEY) return []
    const city = destination.split(',')[0].trim()
    const res  = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&per_page=5&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    )
    const data = await res.json()
    return data.results || []
}

// Temps OpenWeatherMap (sense clau — usem wttr.in gratuït)
async function fetchWeather(city) {
    try {
        const res  = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`)
        const data = await res.json()
        const cur  = data.current_condition?.[0]
        if (!cur) return null
        return {
            temp:    cur.temp_C,
            desc:    cur.weatherDesc?.[0]?.value || '',
            icon:    getWeatherEmoji(parseInt(cur.weatherCode)),
            humidity: cur.humidity,
            wind:    cur.windspeedKmph,
        }
    } catch { return null }
}

function getWeatherEmoji(code) {
    if (code === 113) return '☀️'
    if (code <= 116)  return '⛅'
    if (code <= 122)  return '☁️'
    if (code <= 143)  return '🌫️'
    if (code <= 176)  return '🌦️'
    if (code <= 200)  return '⛈️'
    if (code <= 230)  return '❄️'
    return '🌧️'
}

// Leaflet map component
function LeafletMap({ lat, lon, name }) {
    const mapRef = useRef(null)
    const mapObj = useRef(null)

    useEffect(() => {
        if (!mapRef.current || mapObj.current) return

        // Carrega Leaflet dinàmicament
        const link = document.createElement('link')
        link.rel  = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)

        const script = document.createElement('script')
        script.src   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => {
            const L = window.L
            mapObj.current = L.map(mapRef.current).setView([lat, lon], 13)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(mapObj.current)
            L.marker([lat, lon])
                .addTo(mapObj.current)
                .bindPopup(`<b>${name.split(',')[0]}</b>`)
                .openPopup()
        }
        document.head.appendChild(script)

        return () => { mapObj.current?.remove(); mapObj.current = null }
    }, [lat, lon])

    return <div ref={mapRef} style={{width:'100%',height:'100%'}} aria-label={`Mapa de ${name}`}/>
}

export default function DestinationInfo({ destination }) {
    const [photos,  setPhotos]  = useState([])
    const [weather, setWeather] = useState(null)
    const [coords,  setCoords]  = useState(null)
    const [loading, setLoading] = useState(true)

    const city = destination?.split(',')[0]?.trim()

    useEffect(() => {
        if (!destination) return
        setLoading(true)

        Promise.all([
            fetchPhotos(destination),
            fetchWeather(city),
            geocode(destination),
        ]).then(([p, w, c]) => {
            setPhotos(p)
            setWeather(w)
            setCoords(c)
            setLoading(false)
        })
    }, [destination])

    if (!destination) return null

    return (
        <div className="dinfo">

            {/* Fotos */}
            {loading ? (
                <div className="dinfo__photos">
                    {[...Array(5)].map((_,i) => (
                        <div key={i} className="dinfo__photo">
                            <div className="dinfo__photo-skeleton"/>
                        </div>
                    ))}
                </div>
            ) : photos.length > 0 ? (
                <div className="dinfo__photos" role="img" aria-label={`Fotos de ${city}`}>
                    {photos.slice(0,5).map((p,i) => (
                        <div key={p.id} className="dinfo__photo">
                            <img
                                src={p.urls.regular}
                                alt={p.alt_description || `${city} - foto ${i+1}`}
                                loading={i === 0 ? 'eager' : 'lazy'}
                            />
                            <a
                                href={`${p.user.links.html}?utm_source=tripnest&utm_medium=referral`}
                                target="_blank" rel="noopener noreferrer"
                                className="dinfo__photo-credit"
                                aria-label={`Foto per ${p.user.name} a Unsplash`}
                            >
                                📷 {p.user.name} · Unsplash
                            </a>
                        </div>
                    ))}
                </div>
            ) : null}

            {/* Temps */}
            {weather && (
                <div className="dinfo__weather" role="region" aria-label="Temps actual">
                    <span style={{fontSize:'2.5rem'}} aria-hidden="true">{weather.icon}</span>
                    <div>
                        <div className="dinfo__weather-temp">{weather.temp}°C</div>
                        <div className="dinfo__weather-desc">{weather.desc}</div>
                        <div className="dinfo__weather-loc">💧 {weather.humidity}% · 💨 {weather.wind} km/h</div>
                    </div>
                    <div style={{marginLeft:'auto',textAlign:'right',fontSize:'0.78rem',color:'#aab7c4'}}>
                        Temps actual<br/>a {city}
                    </div>
                </div>
            )}

            {/* Mapa */}
            {coords && (
                <div className="dinfo__map-wrap">
                    <LeafletMap lat={coords.lat} lon={coords.lon} name={city}/>
                </div>
            )}

            {/* Cards info */}
            <div className="dinfo__cards">
                {/* Atraccions */}
                <div className="dinfo__card">
                    <div className="dinfo__card-title">🏛️ Atraccions</div>
                    {MOCK_ATTRACTIONS.default.map(a => (
                        <div key={a.name} className="dinfo__card-item">
                            <span className="dinfo__card-item-icon">{a.icon}</span>
                            <div className="dinfo__card-item-info">
                                <div className="dinfo__card-item-name">{a.name}</div>
                                <div className="dinfo__card-item-sub">{a.type}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Restaurants */}
                <div className="dinfo__card">
                    <div className="dinfo__card-title">🍽️ Restaurants</div>
                    {MOCK_RESTAURANTS.map(r => (
                        <div key={r.name} className="dinfo__card-item">
                            <span className="dinfo__card-item-icon">{r.icon}</span>
                            <div className="dinfo__card-item-info">
                                <div className="dinfo__card-item-name">{r.name}</div>
                                <div className="dinfo__card-item-sub">{r.cuisine}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Hotels */}
                <div className="dinfo__card">
                    <div className="dinfo__card-title">🏨 Allotjament</div>
                    {MOCK_HOTELS.map(h => (
                        <div key={h.name} className="dinfo__card-item">
                            <span className="dinfo__card-item-icon">{h.icon}</span>
                            <div className="dinfo__card-item-info">
                                <div className="dinfo__card-item-name">{h.name}</div>
                                <div className="dinfo__card-item-sub">{h.stars}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}