import { useState, useEffect, useRef, useCallback } from 'react'
import './DestinationPicker.css'

const POPULAR = [
    // Europa
    { name:'Barcelona',      country:'Espanya',        countryCode:'ES', flag:'🇪🇸', type:'Ciutat' },
    { name:'Madrid',         country:'Espanya',        countryCode:'ES', flag:'🇪🇸', type:'Ciutat' },
    { name:'Sevilla',        country:'Espanya',        countryCode:'ES', flag:'🇪🇸', type:'Ciutat' },
    { name:'Màlaga',         country:'Espanya',        countryCode:'ES', flag:'🇪🇸', type:'Platja' },
    { name:'Palma',          country:'Espanya',        countryCode:'ES', flag:'🇪🇸', type:'Illa' },
    { name:'Eivissa',        country:'Espanya',        countryCode:'ES', flag:'🇪🇸', type:'Illa' },
    { name:'Tenerife',       country:'Espanya',        countryCode:'ES', flag:'🇪🇸', type:'Illa' },
    { name:'Gran Canària',   country:'Espanya',        countryCode:'ES', flag:'🇪🇸', type:'Illa' },
    { name:'París',          country:'França',         countryCode:'FR', flag:'🇫🇷', type:'Ciutat' },
    { name:'Niça',           country:'França',         countryCode:'FR', flag:'🇫🇷', type:'Platja' },
    { name:'Marsella',       country:'França',         countryCode:'FR', flag:'🇫🇷', type:'Ciutat' },
    { name:'Lió',            country:'França',         countryCode:'FR', flag:'🇫🇷', type:'Ciutat' },
    { name:'Roma',           country:'Itàlia',         countryCode:'IT', flag:'🇮🇹', type:'Ciutat' },
    { name:'Milà',           country:'Itàlia',         countryCode:'IT', flag:'🇮🇹', type:'Ciutat' },
    { name:'Florència',      country:'Itàlia',         countryCode:'IT', flag:'🇮🇹', type:'Ciutat' },
    { name:'Venècia',        country:'Itàlia',         countryCode:'IT', flag:'🇮🇹', type:'Ciutat' },
    { name:'Nàpols',         country:'Itàlia',         countryCode:'IT', flag:'🇮🇹', type:'Ciutat' },
    { name:'Sicília',        country:'Itàlia',         countryCode:'IT', flag:'🇮🇹', type:'Illa' },
    { name:'Sardenya',       country:'Itàlia',         countryCode:'IT', flag:'🇮🇹', type:'Illa' },
    { name:'Londres',        country:'Regne Unit',     countryCode:'GB', flag:'🇬🇧', type:'Ciutat' },
    { name:'Edimburg',       country:'Regne Unit',     countryCode:'GB', flag:'🇬🇧', type:'Ciutat' },
    { name:'Manchester',     country:'Regne Unit',     countryCode:'GB', flag:'🇬🇧', type:'Ciutat' },
    { name:'Amsterdam',      country:'Holanda',        countryCode:'NL', flag:'🇳🇱', type:'Ciutat' },
    { name:'Lisboa',         country:'Portugal',       countryCode:'PT', flag:'🇵🇹', type:'Ciutat' },
    { name:'Porto',          country:'Portugal',       countryCode:'PT', flag:'🇵🇹', type:'Ciutat' },
    { name:'Algarve',        country:'Portugal',       countryCode:'PT', flag:'🇵🇹', type:'Platja' },
    { name:'Praga',          country:'Txèquia',        countryCode:'CZ', flag:'🇨🇿', type:'Ciutat' },
    { name:'Budapest',       country:'Hongria',        countryCode:'HU', flag:'🇭🇺', type:'Ciutat' },
    { name:'Viena',          country:'Àustria',        countryCode:'AT', flag:'🇦🇹', type:'Ciutat' },
    { name:'Salzburg',       country:'Àustria',        countryCode:'AT', flag:'🇦🇹', type:'Muntanya' },
    { name:'Berlín',         country:'Alemanya',       countryCode:'DE', flag:'🇩🇪', type:'Ciutat' },
    { name:'Munic',          country:'Alemanya',       countryCode:'DE', flag:'🇩🇪', type:'Ciutat' },
    { name:'Hamburg',        country:'Alemanya',       countryCode:'DE', flag:'🇩🇪', type:'Ciutat' },
    { name:'Estocolm',       country:'Suècia',         countryCode:'SE', flag:'🇸🇪', type:'Ciutat' },
    { name:'Göteborg',       country:'Suècia',         countryCode:'SE', flag:'🇸🇪', type:'Ciutat' },
    { name:'Oslo',           country:'Noruega',        countryCode:'NO', flag:'🇳🇴', type:'Ciutat' },
    { name:'Bergen',         country:'Noruega',        countryCode:'NO', flag:'🇳🇴', type:'Natura' },
    { name:'Copenhaguen',    country:'Dinamarca',      countryCode:'DK', flag:'🇩🇰', type:'Ciutat' },
    { name:'Hèlsinki',       country:'Finlàndia',      countryCode:'FI', flag:'🇫🇮', type:'Ciutat' },
    { name:'Reykjavik',      country:'Islàndia',       countryCode:'IS', flag:'🇮🇸', type:'Natura' },
    { name:'Varsòvia',       country:'Polònia',        countryCode:'PL', flag:'🇵🇱', type:'Ciutat' },
    { name:'Cracòvia',       country:'Polònia',        countryCode:'PL', flag:'🇵🇱', type:'Ciutat' },
    { name:'Dubrovnik',      country:'Croàcia',        countryCode:'HR', flag:'🇭🇷', type:'Platja' },
    { name:'Split',          country:'Croàcia',        countryCode:'HR', flag:'🇭🇷', type:'Platja' },
    { name:'Atenes',         country:'Grècia',         countryCode:'GR', flag:'🇬🇷', type:'Ciutat' },
    { name:'Santorini',      country:'Grècia',         countryCode:'GR', flag:'🇬🇷', type:'Illa' },
    { name:'Mikonos',        country:'Grècia',         countryCode:'GR', flag:'🇬🇷', type:'Illa' },
    { name:'Creta',          country:'Grècia',         countryCode:'GR', flag:'🇬🇷', type:'Illa' },
    { name:'Istanbul',       country:'Turquia',        countryCode:'TR', flag:'🇹🇷', type:'Ciutat' },
    { name:'Capadòcia',      country:'Turquia',        countryCode:'TR', flag:'🇹🇷', type:'Natura' },
    { name:'Antalya',        country:'Turquia',        countryCode:'TR', flag:'🇹🇷', type:'Platja' },
    { name:'Brussel·les',    country:'Bèlgica',        countryCode:'BE', flag:'🇧🇪', type:'Ciutat' },
    { name:'Bruges',         country:'Bèlgica',        countryCode:'BE', flag:'🇧🇪', type:'Ciutat' },
    { name:'Zuric',          country:'Suïssa',         countryCode:'CH', flag:'🇨🇭', type:'Ciutat' },
    { name:'Ginebra',        country:'Suïssa',         countryCode:'CH', flag:'🇨🇭', type:'Natura' },
    { name:'Interlaken',     country:'Suïssa',         countryCode:'CH', flag:'🇨🇭', type:'Muntanya' },
    { name:'Bucarest',       country:'Romania',        countryCode:'RO', flag:'🇷🇴', type:'Ciutat' },
    { name:'Tallinn',        country:'Estònia',        countryCode:'EE', flag:'🇪🇪', type:'Ciutat' },
    { name:'Riga',           country:'Letònia',        countryCode:'LV', flag:'🇱🇻', type:'Ciutat' },
    { name:'Vilnius',        country:'Lituània',       countryCode:'LT', flag:'🇱🇹', type:'Ciutat' },
    { name:'Valletta',       country:'Malta',          countryCode:'MT', flag:'🇲🇹', type:'Illa' },
    // Àsia
    { name:'Tòquio',         country:'Japó',           countryCode:'JP', flag:'🇯🇵', type:'Ciutat' },
    { name:'Kyoto',          country:'Japó',           countryCode:'JP', flag:'🇯🇵', type:'Cultura' },
    { name:'Osaka',          country:'Japó',           countryCode:'JP', flag:'🇯🇵', type:'Ciutat' },
    { name:'Hiroshima',      country:'Japó',           countryCode:'JP', flag:'🇯🇵', type:'Cultura' },
    { name:'Seül',           country:'Corea del Sud',  countryCode:'KR', flag:'🇰🇷', type:'Ciutat' },
    { name:'Busan',          country:'Corea del Sud',  countryCode:'KR', flag:'🇰🇷', type:'Platja' },
    { name:'Pequín',         country:'Xina',           countryCode:'CN', flag:'🇨🇳', type:'Ciutat' },
    { name:'Xangai',         country:'Xina',           countryCode:'CN', flag:'🇨🇳', type:'Ciutat' },
    { name:'Hong Kong',      country:'Xina',           countryCode:'HK', flag:'🇭🇰', type:'Ciutat' },
    { name:'Bangkok',        country:'Tailàndia',      countryCode:'TH', flag:'🇹🇭', type:'Ciutat' },
    { name:'Phuket',         country:'Tailàndia',      countryCode:'TH', flag:'🇹🇭', type:'Illa' },
    { name:'Chiang Mai',     country:'Tailàndia',      countryCode:'TH', flag:'🇹🇭', type:'Cultura' },
    { name:'Bali',           country:'Indonèsia',      countryCode:'ID', flag:'🇮🇩', type:'Illa' },
    { name:'Jakarta',        country:'Indonèsia',      countryCode:'ID', flag:'🇮🇩', type:'Ciutat' },
    { name:'Singapur',       country:'Singapur',       countryCode:'SG', flag:'🇸🇬', type:'Ciutat' },
    { name:'Kuala Lumpur',   country:'Malàisia',       countryCode:'MY', flag:'🇲🇾', type:'Ciutat' },
    { name:'Hanoi',          country:'Vietnam',        countryCode:'VN', flag:'🇻🇳', type:'Cultura' },
    { name:'Ho Chi Minh',    country:'Vietnam',        countryCode:'VN', flag:'🇻🇳', type:'Ciutat' },
    { name:'Ha Long Bay',    country:'Vietnam',        countryCode:'VN', flag:'🇻🇳', type:'Natura' },
    { name:'Siem Reap',      country:'Cambodja',       countryCode:'KH', flag:'🇰🇭', type:'Cultura' },
    { name:'Mumbai',         country:'Índia',          countryCode:'IN', flag:'🇮🇳', type:'Ciutat' },
    { name:'Nova Delhi',     country:'Índia',          countryCode:'IN', flag:'🇮🇳', type:'Cultura' },
    { name:'Jaipur',         country:'Índia',          countryCode:'IN', flag:'🇮🇳', type:'Cultura' },
    { name:'Goa',            country:'Índia',          countryCode:'IN', flag:'🇮🇳', type:'Platja' },
    { name:'Katmandú',       country:'Nepal',          countryCode:'NP', flag:'🇳🇵', type:'Muntanya' },
    { name:'Colombo',        country:'Sri Lanka',      countryCode:'LK', flag:'🇱🇰', type:'Illa' },
    { name:'Dubai',          country:'Emirats Àrabs',  countryCode:'AE', flag:'🇦🇪', type:'Ciutat' },
    { name:'Abu Dhabi',      country:'Emirats Àrabs',  countryCode:'AE', flag:'🇦🇪', type:'Ciutat' },
    { name:'Tel Aviv',       country:'Israel',         countryCode:'IL', flag:'🇮🇱', type:'Platja' },
    { name:'Jerusalem',      country:'Israel',         countryCode:'IL', flag:'🇮🇱', type:'Cultura' },
    { name:'Tòquio',         country:'Japó',           countryCode:'JP', flag:'🇯🇵', type:'Ciutat' },
    // Àfrica
    { name:'Marràqueix',     country:'Marroc',         countryCode:'MA', flag:'🇲🇦', type:'Cultura' },
    { name:'Fes',            country:'Marroc',         countryCode:'MA', flag:'🇲🇦', type:'Cultura' },
    { name:'Casablanca',     country:'Marroc',         countryCode:'MA', flag:'🇲🇦', type:'Ciutat' },
    { name:'Cairo',          country:'Egipte',         countryCode:'EG', flag:'🇪🇬', type:'Cultura' },
    { name:'Hurghada',       country:'Egipte',         countryCode:'EG', flag:'🇪🇬', type:'Platja' },
    { name:'Nairobi',        country:'Kenya',          countryCode:'KE', flag:'🇰🇪', type:'Natura' },
    { name:'Zanzibar',       country:'Tanzània',       countryCode:'TZ', flag:'🇹🇿', type:'Illa' },
    { name:'Serengeti',      country:'Tanzània',       countryCode:'TZ', flag:'🇹🇿', type:'Natura' },
    { name:'Cape Town',      country:'Sud-àfrica',     countryCode:'ZA', flag:'🇿🇦', type:'Natura' },
    { name:'Johannesburg',   country:'Sud-àfrica',     countryCode:'ZA', flag:'🇿🇦', type:'Ciutat' },
    { name:'Maldives',       country:'Maldives',       countryCode:'MV', flag:'🇲🇻', type:'Illa' },
    { name:'Seychelles',     country:'Seychelles',     countryCode:'SC', flag:'🇸🇨', type:'Illa' },
    { name:'Maurici',        country:'Maurici',        countryCode:'MU', flag:'🇲🇺', type:'Illa' },
    { name:'Tunis',          country:'Tunísia',        countryCode:'TN', flag:'🇹🇳', type:'Platja' },
    // Amèrica
    { name:'Nova York',      country:'EUA',            countryCode:'US', flag:'🇺🇸', type:'Ciutat' },
    { name:'Los Angeles',    country:'EUA',            countryCode:'US', flag:'🇺🇸', type:'Platja' },
    { name:'Miami',          country:'EUA',            countryCode:'US', flag:'🇺🇸', type:'Platja' },
    { name:'Chicago',        country:'EUA',            countryCode:'US', flag:'🇺🇸', type:'Ciutat' },
    { name:'San Francisco',  country:'EUA',            countryCode:'US', flag:'🇺🇸', type:'Ciutat' },
    { name:'Las Vegas',      country:'EUA',            countryCode:'US', flag:'🇺🇸', type:'Ciutat' },
    { name:'Honolulu',       country:'EUA',            countryCode:'US', flag:'🇺🇸', type:'Illa' },
    { name:'Nova Orleans',   country:'EUA',            countryCode:'US', flag:'🇺🇸', type:'Cultura' },
    { name:'Toronto',        country:'Canadà',         countryCode:'CA', flag:'🇨🇦', type:'Ciutat' },
    { name:'Vancouver',      country:'Canadà',         countryCode:'CA', flag:'🇨🇦', type:'Natura' },
    { name:'Montreal',       country:'Canadà',         countryCode:'CA', flag:'🇨🇦', type:'Cultura' },
    { name:'Cancún',         country:'Mèxic',          countryCode:'MX', flag:'🇲🇽', type:'Platja' },
    { name:'Ciutat de Mèxic',country:'Mèxic',          countryCode:'MX', flag:'🇲🇽', type:'Cultura' },
    { name:'Guadalajara',    country:'Mèxic',          countryCode:'MX', flag:'🇲🇽', type:'Cultura' },
    { name:'La Havana',      country:'Cuba',           countryCode:'CU', flag:'🇨🇺', type:'Cultura' },
    { name:'Cartagena',      country:'Colòmbia',       countryCode:'CO', flag:'🇨🇴', type:'Platja' },
    { name:'Medellín',       country:'Colòmbia',       countryCode:'CO', flag:'🇨🇴', type:'Cultura' },
    { name:'Bogotà',         country:'Colòmbia',       countryCode:'CO', flag:'🇨🇴', type:'Cultura' },
    { name:'Buenos Aires',   country:'Argentina',      countryCode:'AR', flag:'🇦🇷', type:'Cultura' },
    { name:'Patagònia',      country:'Argentina',      countryCode:'AR', flag:'🇦🇷', type:'Natura' },
    { name:'Rio de Janeiro', country:'Brasil',         countryCode:'BR', flag:'🇧🇷', type:'Platja' },
    { name:'São Paulo',      country:'Brasil',         countryCode:'BR', flag:'🇧🇷', type:'Ciutat' },
    { name:'Salvador',       country:'Brasil',         countryCode:'BR', flag:'🇧🇷', type:'Platja' },
    { name:'Lima',           country:'Perú',           countryCode:'PE', flag:'🇵🇪', type:'Cultura' },
    { name:'Cusco',          country:'Perú',           countryCode:'PE', flag:'🇵🇪', type:'Natura' },
    { name:'Santiago',       country:'Xile',           countryCode:'CL', flag:'🇨🇱', type:'Natura' },
    { name:'Punta Arenas',   country:'Xile',           countryCode:'CL', flag:'🇨🇱', type:'Natura' },
    { name:'Quito',          country:'Equador',        countryCode:'EC', flag:'🇪🇨', type:'Natura' },
    { name:'Galápagos',      country:'Equador',        countryCode:'EC', flag:'🇪🇨', type:'Natura' },
    { name:'San José',       country:'Costa Rica',     countryCode:'CR', flag:'🇨🇷', type:'Natura' },
    { name:'Punta Cana',     country:'Rep. Dominicana',countryCode:'DO', flag:'🇩🇴', type:'Platja' },
    // Oceania
    { name:'Sydney',         country:'Austràlia',      countryCode:'AU', flag:'🇦🇺', type:'Platja' },
    { name:'Melbourne',      country:'Austràlia',      countryCode:'AU', flag:'🇦🇺', type:'Cultura' },
    { name:'Cairns',         country:'Austràlia',      countryCode:'AU', flag:'🇦🇺', type:'Natura' },
    { name:'Auckland',       country:'Nova Zelanda',   countryCode:'NZ', flag:'🇳🇿', type:'Natura' },
    { name:'Queenstown',     country:'Nova Zelanda',   countryCode:'NZ', flag:'🇳🇿', type:'Aventura' },
    { name:'Fiji',           country:'Fiji',           countryCode:'FJ', flag:'🇫🇯', type:'Illa' },
    { name:'Bora Bora',      country:'Polinèsia Francesa',countryCode:'PF',flag:'🇵🇫',type:'Illa' },
]

// Elimina duplicats per nom+codi
const DESTINATIONS = POPULAR.filter((d, i, arr) =>
    arr.findIndex(x => x.name === d.name && x.countryCode === d.countryCode) === i
)

// Destins destacats per mostrar per defecte
const FEATURED = ['Barcelona','París','Bali','Tòquio','Marràqueix','Roma','Bangkok','Nova York']
    .map(n => DESTINATIONS.find(d => d.name === n)).filter(Boolean)

const TYPE_COLOR = {
    Platja:   '#3498DB', Illa: '#9B59B6', Muntanya: '#27AE60', Natura: '#16A085',
    Cultura:  '#E67E22', Aventura: '#E74C3C', Ciutat: '#7F8C8D',
}

function normalize(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export default function DestinationPicker({ value, onChange, required }) {
    const [query,    setQuery]    = useState(value || '')
    const [results,  setResults]  = useState([])
    const [open,     setOpen]     = useState(false)
    const [selected, setSelected] = useState(value ? { name: value } : null)
    const [activeIdx,setActiveIdx]= useState(-1)
    const inputRef = useRef(null)
    const dropRef  = useRef(null)
    const timerRef = useRef(null)

    useEffect(() => {
        const handler = (e) => {
            if (!dropRef.current?.contains(e.target) && !inputRef.current?.contains(e.target))
                setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const search = useCallback((q) => {
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            const norm = normalize(q)
            const found = DESTINATIONS.filter(d =>
                normalize(d.name).includes(norm) || normalize(d.country).includes(norm) ||
                normalize(d.type).includes(norm)
            ).slice(0, 10)
            setResults(found)
            setOpen(true)
        }, 120)
    }, [])

    const handleInput = (e) => {
        const q = e.target.value
        setQuery(q); setSelected(null); onChange(q); setActiveIdx(-1)
        if (q.length === 0) { setResults(FEATURED); setOpen(true) }
        else search(q)
    }

    const handleSelect = (item) => {
        const full = `${item.name}, ${item.country}`
        setQuery(full); setSelected(item); onChange(full)
        setOpen(false); setResults([])
    }

    const handleClear = () => {
        setQuery(''); setSelected(null); onChange('')
        setResults(FEATURED); setOpen(true)
        inputRef.current?.focus()
    }

    const handleFocus = () => {
        if (!selected) {
            setResults(query.length > 0 ? results : FEATURED)
            setOpen(true)
        }
    }

    const handleKeyDown = (e) => {
        if (!open || results.length === 0) return
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i+1, results.length-1)) }
        if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i-1, 0)) }
        if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); handleSelect(results[activeIdx]) }
        if (e.key === 'Escape') setOpen(false)
    }

    const showFeatured = query.length === 0

    return (
        <div className="dp">
            {selected ? (
                <div className="dp__selected">
                    <span className="dp__selected-flag">{selected.flag || '📍'}</span>
                    <span className="dp__selected-text">{query}</span>
                    <span style={{fontSize:'0.72rem',background:TYPE_COLOR[selected.type]||'#999',
                        color:'#fff',padding:'2px 8px',borderRadius:50,fontWeight:700}}>
            {selected.type}
          </span>
                    <button type="button" className="dp__selected-change" onClick={handleClear}>Canviar</button>
                </div>
            ) : (
                <div className="dp__input-wrap">
                    <span className="dp__input-icon">📍</span>
                    <input
                        ref={inputRef}
                        className="dp__input"
                        type="text"
                        value={query}
                        onChange={handleInput}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                        placeholder="Cerca una ciutat, país o tipus de destí..."
                        autoComplete="off"
                        required={required}
                    />
                    {query && (
                        <button type="button" className="dp__clear" onClick={handleClear}>✕</button>
                    )}
                </div>
            )}

            {open && results.length > 0 && !selected && (
                <div className="dp__dropdown" ref={dropRef}>
                    <div className="dp__section-title">
                        {showFeatured ? '⭐ Destins destacats' : `🔍 ${results.length} resultats`}
                    </div>
                    {results.map((item, i) => (
                        <button
                            key={`${item.name}-${item.countryCode}-${i}`}
                            type="button"
                            className={`dp__item ${i === activeIdx ? 'dp__item--active' : ''}`}
                            onClick={() => handleSelect(item)}
                        >
                            <span className="dp__item-flag">{item.flag}</span>
                            <div className="dp__item-info">
                                <div className="dp__item-name">{item.name}</div>
                                <div className="dp__item-sub">{item.country}</div>
                            </div>
                            <span className="dp__item-type" style={{
                                background: (TYPE_COLOR[item.type]||'#7F8C8D') + '18',
                                color: TYPE_COLOR[item.type]||'#7F8C8D'
                            }}>{item.type}</span>
                        </button>
                    ))}
                </div>
            )}

            {open && results.length === 0 && query.length > 1 && !selected && (
                <div className="dp__dropdown" ref={dropRef}>
                    <div className="dp__no-results">
                        <div style={{fontSize:'1.5rem',marginBottom:6}}>🔍</div>
                        No trobat. Escriu-lo manualment i prem Enter.
                    </div>
                </div>
            )}
        </div>
    )
}