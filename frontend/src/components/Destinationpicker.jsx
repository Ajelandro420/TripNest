// Buscador/autocomplete de destinos con sugerencias destacadas.
import { useState, useEffect, useRef, useCallback } from 'react'

const POPULAR = [
    // Europa
    { name:'Barcelona',      country:'Espanya',        countryCode:'ES', flag:'ðŸ‡ªðŸ‡¸', type:'Ciutat' },
    { name:'Madrid',         country:'Espanya',        countryCode:'ES', flag:'ðŸ‡ªðŸ‡¸', type:'Ciutat' },
    { name:'Sevilla',        country:'Espanya',        countryCode:'ES', flag:'ðŸ‡ªðŸ‡¸', type:'Ciutat' },
    { name:'MÃ laga',         country:'Espanya',        countryCode:'ES', flag:'ðŸ‡ªðŸ‡¸', type:'Platja' },
    { name:'Palma',          country:'Espanya',        countryCode:'ES', flag:'ðŸ‡ªðŸ‡¸', type:'Illa' },
    { name:'Eivissa',        country:'Espanya',        countryCode:'ES', flag:'ðŸ‡ªðŸ‡¸', type:'Illa' },
    { name:'Tenerife',       country:'Espanya',        countryCode:'ES', flag:'ðŸ‡ªðŸ‡¸', type:'Illa' },
    { name:'Gran CanÃ ria',   country:'Espanya',        countryCode:'ES', flag:'ðŸ‡ªðŸ‡¸', type:'Illa' },
    { name:'ParÃ­s',          country:'FranÃ§a',         countryCode:'FR', flag:'ðŸ‡«ðŸ‡·', type:'Ciutat' },
    { name:'NiÃ§a',           country:'FranÃ§a',         countryCode:'FR', flag:'ðŸ‡«ðŸ‡·', type:'Platja' },
    { name:'Marsella',       country:'FranÃ§a',         countryCode:'FR', flag:'ðŸ‡«ðŸ‡·', type:'Ciutat' },
    { name:'LiÃ³',            country:'FranÃ§a',         countryCode:'FR', flag:'ðŸ‡«ðŸ‡·', type:'Ciutat' },
    { name:'Roma',           country:'ItÃ lia',         countryCode:'IT', flag:'ðŸ‡®ðŸ‡¹', type:'Ciutat' },
    { name:'MilÃ ',           country:'ItÃ lia',         countryCode:'IT', flag:'ðŸ‡®ðŸ‡¹', type:'Ciutat' },
    { name:'FlorÃ¨ncia',      country:'ItÃ lia',         countryCode:'IT', flag:'ðŸ‡®ðŸ‡¹', type:'Ciutat' },
    { name:'VenÃ¨cia',        country:'ItÃ lia',         countryCode:'IT', flag:'ðŸ‡®ðŸ‡¹', type:'Ciutat' },
    { name:'NÃ pols',         country:'ItÃ lia',         countryCode:'IT', flag:'ðŸ‡®ðŸ‡¹', type:'Ciutat' },
    { name:'SicÃ­lia',        country:'ItÃ lia',         countryCode:'IT', flag:'ðŸ‡®ðŸ‡¹', type:'Illa' },
    { name:'Sardenya',       country:'ItÃ lia',         countryCode:'IT', flag:'ðŸ‡®ðŸ‡¹', type:'Illa' },
    { name:'Londres',        country:'Regne Unit',     countryCode:'GB', flag:'ðŸ‡¬ðŸ‡§', type:'Ciutat' },
    { name:'Edimburg',       country:'Regne Unit',     countryCode:'GB', flag:'ðŸ‡¬ðŸ‡§', type:'Ciutat' },
    { name:'Manchester',     country:'Regne Unit',     countryCode:'GB', flag:'ðŸ‡¬ðŸ‡§', type:'Ciutat' },
    { name:'Amsterdam',      country:'Holanda',        countryCode:'NL', flag:'ðŸ‡³ðŸ‡±', type:'Ciutat' },
    { name:'Lisboa',         country:'Portugal',       countryCode:'PT', flag:'ðŸ‡µðŸ‡¹', type:'Ciutat' },
    { name:'Porto',          country:'Portugal',       countryCode:'PT', flag:'ðŸ‡µðŸ‡¹', type:'Ciutat' },
    { name:'Algarve',        country:'Portugal',       countryCode:'PT', flag:'ðŸ‡µðŸ‡¹', type:'Platja' },
    { name:'Praga',          country:'TxÃ¨quia',        countryCode:'CZ', flag:'ðŸ‡¨ðŸ‡¿', type:'Ciutat' },
    { name:'Budapest',       country:'Hongria',        countryCode:'HU', flag:'ðŸ‡­ðŸ‡º', type:'Ciutat' },
    { name:'Viena',          country:'Ã€ustria',        countryCode:'AT', flag:'ðŸ‡¦ðŸ‡¹', type:'Ciutat' },
    { name:'Salzburg',       country:'Ã€ustria',        countryCode:'AT', flag:'ðŸ‡¦ðŸ‡¹', type:'Muntanya' },
    { name:'BerlÃ­n',         country:'Alemanya',       countryCode:'DE', flag:'ðŸ‡©ðŸ‡ª', type:'Ciutat' },
    { name:'Munic',          country:'Alemanya',       countryCode:'DE', flag:'ðŸ‡©ðŸ‡ª', type:'Ciutat' },
    { name:'Hamburg',        country:'Alemanya',       countryCode:'DE', flag:'ðŸ‡©ðŸ‡ª', type:'Ciutat' },
    { name:'Estocolm',       country:'SuÃ¨cia',         countryCode:'SE', flag:'ðŸ‡¸ðŸ‡ª', type:'Ciutat' },
    { name:'GÃ¶teborg',       country:'SuÃ¨cia',         countryCode:'SE', flag:'ðŸ‡¸ðŸ‡ª', type:'Ciutat' },
    { name:'Oslo',           country:'Noruega',        countryCode:'NO', flag:'ðŸ‡³ðŸ‡´', type:'Ciutat' },
    { name:'Bergen',         country:'Noruega',        countryCode:'NO', flag:'ðŸ‡³ðŸ‡´', type:'Natura' },
    { name:'Copenhaguen',    country:'Dinamarca',      countryCode:'DK', flag:'ðŸ‡©ðŸ‡°', type:'Ciutat' },
    { name:'HÃ¨lsinki',       country:'FinlÃ ndia',      countryCode:'FI', flag:'ðŸ‡«ðŸ‡®', type:'Ciutat' },
    { name:'Reykjavik',      country:'IslÃ ndia',       countryCode:'IS', flag:'ðŸ‡®ðŸ‡¸', type:'Natura' },
    { name:'VarsÃ²via',       country:'PolÃ²nia',        countryCode:'PL', flag:'ðŸ‡µðŸ‡±', type:'Ciutat' },
    { name:'CracÃ²via',       country:'PolÃ²nia',        countryCode:'PL', flag:'ðŸ‡µðŸ‡±', type:'Ciutat' },
    { name:'Dubrovnik',      country:'CroÃ cia',        countryCode:'HR', flag:'ðŸ‡­ðŸ‡·', type:'Platja' },
    { name:'Split',          country:'CroÃ cia',        countryCode:'HR', flag:'ðŸ‡­ðŸ‡·', type:'Platja' },
    { name:'Atenes',         country:'GrÃ¨cia',         countryCode:'GR', flag:'ðŸ‡¬ðŸ‡·', type:'Ciutat' },
    { name:'Santorini',      country:'GrÃ¨cia',         countryCode:'GR', flag:'ðŸ‡¬ðŸ‡·', type:'Illa' },
    { name:'Mikonos',        country:'GrÃ¨cia',         countryCode:'GR', flag:'ðŸ‡¬ðŸ‡·', type:'Illa' },
    { name:'Creta',          country:'GrÃ¨cia',         countryCode:'GR', flag:'ðŸ‡¬ðŸ‡·', type:'Illa' },
    { name:'Istanbul',       country:'Turquia',        countryCode:'TR', flag:'ðŸ‡¹ðŸ‡·', type:'Ciutat' },
    { name:'CapadÃ²cia',      country:'Turquia',        countryCode:'TR', flag:'ðŸ‡¹ðŸ‡·', type:'Natura' },
    { name:'Antalya',        country:'Turquia',        countryCode:'TR', flag:'ðŸ‡¹ðŸ‡·', type:'Platja' },
    { name:'BrusselÂ·les',    country:'BÃ¨lgica',        countryCode:'BE', flag:'ðŸ‡§ðŸ‡ª', type:'Ciutat' },
    { name:'Bruges',         country:'BÃ¨lgica',        countryCode:'BE', flag:'ðŸ‡§ðŸ‡ª', type:'Ciutat' },
    { name:'Zuric',          country:'SuÃ¯ssa',         countryCode:'CH', flag:'ðŸ‡¨ðŸ‡­', type:'Ciutat' },
    { name:'Ginebra',        country:'SuÃ¯ssa',         countryCode:'CH', flag:'ðŸ‡¨ðŸ‡­', type:'Natura' },
    { name:'Interlaken',     country:'SuÃ¯ssa',         countryCode:'CH', flag:'ðŸ‡¨ðŸ‡­', type:'Muntanya' },
    { name:'Bucarest',       country:'Romania',        countryCode:'RO', flag:'ðŸ‡·ðŸ‡´', type:'Ciutat' },
    { name:'Tallinn',        country:'EstÃ²nia',        countryCode:'EE', flag:'ðŸ‡ªðŸ‡ª', type:'Ciutat' },
    { name:'Riga',           country:'LetÃ²nia',        countryCode:'LV', flag:'ðŸ‡±ðŸ‡»', type:'Ciutat' },
    { name:'Vilnius',        country:'LituÃ nia',       countryCode:'LT', flag:'ðŸ‡±ðŸ‡¹', type:'Ciutat' },
    { name:'Valletta',       country:'Malta',          countryCode:'MT', flag:'ðŸ‡²ðŸ‡¹', type:'Illa' },
    // Ã€sia
    { name:'TÃ²quio',         country:'JapÃ³',           countryCode:'JP', flag:'ðŸ‡¯ðŸ‡µ', type:'Ciutat' },
    { name:'Kyoto',          country:'JapÃ³',           countryCode:'JP', flag:'ðŸ‡¯ðŸ‡µ', type:'Cultura' },
    { name:'Osaka',          country:'JapÃ³',           countryCode:'JP', flag:'ðŸ‡¯ðŸ‡µ', type:'Ciutat' },
    { name:'Hiroshima',      country:'JapÃ³',           countryCode:'JP', flag:'ðŸ‡¯ðŸ‡µ', type:'Cultura' },
    { name:'SeÃ¼l',           country:'Corea del Sud',  countryCode:'KR', flag:'ðŸ‡°ðŸ‡·', type:'Ciutat' },
    { name:'Busan',          country:'Corea del Sud',  countryCode:'KR', flag:'ðŸ‡°ðŸ‡·', type:'Platja' },
    { name:'PequÃ­n',         country:'Xina',           countryCode:'CN', flag:'ðŸ‡¨ðŸ‡³', type:'Ciutat' },
    { name:'Xangai',         country:'Xina',           countryCode:'CN', flag:'ðŸ‡¨ðŸ‡³', type:'Ciutat' },
    { name:'Hong Kong',      country:'Xina',           countryCode:'HK', flag:'ðŸ‡­ðŸ‡°', type:'Ciutat' },
    { name:'Bangkok',        country:'TailÃ ndia',      countryCode:'TH', flag:'ðŸ‡¹ðŸ‡­', type:'Ciutat' },
    { name:'Phuket',         country:'TailÃ ndia',      countryCode:'TH', flag:'ðŸ‡¹ðŸ‡­', type:'Illa' },
    { name:'Chiang Mai',     country:'TailÃ ndia',      countryCode:'TH', flag:'ðŸ‡¹ðŸ‡­', type:'Cultura' },
    { name:'Bali',           country:'IndonÃ¨sia',      countryCode:'ID', flag:'ðŸ‡®ðŸ‡©', type:'Illa' },
    { name:'Jakarta',        country:'IndonÃ¨sia',      countryCode:'ID', flag:'ðŸ‡®ðŸ‡©', type:'Ciutat' },
    { name:'Singapur',       country:'Singapur',       countryCode:'SG', flag:'ðŸ‡¸ðŸ‡¬', type:'Ciutat' },
    { name:'Kuala Lumpur',   country:'MalÃ isia',       countryCode:'MY', flag:'ðŸ‡²ðŸ‡¾', type:'Ciutat' },
    { name:'Hanoi',          country:'Vietnam',        countryCode:'VN', flag:'ðŸ‡»ðŸ‡³', type:'Cultura' },
    { name:'Ho Chi Minh',    country:'Vietnam',        countryCode:'VN', flag:'ðŸ‡»ðŸ‡³', type:'Ciutat' },
    { name:'Ha Long Bay',    country:'Vietnam',        countryCode:'VN', flag:'ðŸ‡»ðŸ‡³', type:'Natura' },
    { name:'Siem Reap',      country:'Cambodja',       countryCode:'KH', flag:'ðŸ‡°ðŸ‡­', type:'Cultura' },
    { name:'Mumbai',         country:'Ãndia',          countryCode:'IN', flag:'ðŸ‡®ðŸ‡³', type:'Ciutat' },
    { name:'Nova Delhi',     country:'Ãndia',          countryCode:'IN', flag:'ðŸ‡®ðŸ‡³', type:'Cultura' },
    { name:'Jaipur',         country:'Ãndia',          countryCode:'IN', flag:'ðŸ‡®ðŸ‡³', type:'Cultura' },
    { name:'Goa',            country:'Ãndia',          countryCode:'IN', flag:'ðŸ‡®ðŸ‡³', type:'Platja' },
    { name:'KatmandÃº',       country:'Nepal',          countryCode:'NP', flag:'ðŸ‡³ðŸ‡µ', type:'Muntanya' },
    { name:'Colombo',        country:'Sri Lanka',      countryCode:'LK', flag:'ðŸ‡±ðŸ‡°', type:'Illa' },
    { name:'Dubai',          country:'Emirats Ã€rabs',  countryCode:'AE', flag:'ðŸ‡¦ðŸ‡ª', type:'Ciutat' },
    { name:'Abu Dhabi',      country:'Emirats Ã€rabs',  countryCode:'AE', flag:'ðŸ‡¦ðŸ‡ª', type:'Ciutat' },
    { name:'Tel Aviv',       country:'Israel',         countryCode:'IL', flag:'ðŸ‡®ðŸ‡±', type:'Platja' },
    { name:'Jerusalem',      country:'Israel',         countryCode:'IL', flag:'ðŸ‡®ðŸ‡±', type:'Cultura' },
    { name:'TÃ²quio',         country:'JapÃ³',           countryCode:'JP', flag:'ðŸ‡¯ðŸ‡µ', type:'Ciutat' },
    // Ã€frica
    { name:'MarrÃ queix',     country:'Marroc',         countryCode:'MA', flag:'ðŸ‡²ðŸ‡¦', type:'Cultura' },
    { name:'Fes',            country:'Marroc',         countryCode:'MA', flag:'ðŸ‡²ðŸ‡¦', type:'Cultura' },
    { name:'Casablanca',     country:'Marroc',         countryCode:'MA', flag:'ðŸ‡²ðŸ‡¦', type:'Ciutat' },
    { name:'Cairo',          country:'Egipte',         countryCode:'EG', flag:'ðŸ‡ªðŸ‡¬', type:'Cultura' },
    { name:'Hurghada',       country:'Egipte',         countryCode:'EG', flag:'ðŸ‡ªðŸ‡¬', type:'Platja' },
    { name:'Nairobi',        country:'Kenya',          countryCode:'KE', flag:'ðŸ‡°ðŸ‡ª', type:'Natura' },
    { name:'Zanzibar',       country:'TanzÃ nia',       countryCode:'TZ', flag:'ðŸ‡¹ðŸ‡¿', type:'Illa' },
    { name:'Serengeti',      country:'TanzÃ nia',       countryCode:'TZ', flag:'ðŸ‡¹ðŸ‡¿', type:'Natura' },
    { name:'Cape Town',      country:'Sud-Ã frica',     countryCode:'ZA', flag:'ðŸ‡¿ðŸ‡¦', type:'Natura' },
    { name:'Johannesburg',   country:'Sud-Ã frica',     countryCode:'ZA', flag:'ðŸ‡¿ðŸ‡¦', type:'Ciutat' },
    { name:'Maldives',       country:'Maldives',       countryCode:'MV', flag:'ðŸ‡²ðŸ‡»', type:'Illa' },
    { name:'Seychelles',     country:'Seychelles',     countryCode:'SC', flag:'ðŸ‡¸ðŸ‡¨', type:'Illa' },
    { name:'Maurici',        country:'Maurici',        countryCode:'MU', flag:'ðŸ‡²ðŸ‡º', type:'Illa' },
    { name:'Tunis',          country:'TunÃ­sia',        countryCode:'TN', flag:'ðŸ‡¹ðŸ‡³', type:'Platja' },
    // AmÃ¨rica
    { name:'Nova York',      country:'EUA',            countryCode:'US', flag:'ðŸ‡ºðŸ‡¸', type:'Ciutat' },
    { name:'Los Angeles',    country:'EUA',            countryCode:'US', flag:'ðŸ‡ºðŸ‡¸', type:'Platja' },
    { name:'Miami',          country:'EUA',            countryCode:'US', flag:'ðŸ‡ºðŸ‡¸', type:'Platja' },
    { name:'Chicago',        country:'EUA',            countryCode:'US', flag:'ðŸ‡ºðŸ‡¸', type:'Ciutat' },
    { name:'San Francisco',  country:'EUA',            countryCode:'US', flag:'ðŸ‡ºðŸ‡¸', type:'Ciutat' },
    { name:'Las Vegas',      country:'EUA',            countryCode:'US', flag:'ðŸ‡ºðŸ‡¸', type:'Ciutat' },
    { name:'Honolulu',       country:'EUA',            countryCode:'US', flag:'ðŸ‡ºðŸ‡¸', type:'Illa' },
    { name:'Nova Orleans',   country:'EUA',            countryCode:'US', flag:'ðŸ‡ºðŸ‡¸', type:'Cultura' },
    { name:'Toronto',        country:'CanadÃ ',         countryCode:'CA', flag:'ðŸ‡¨ðŸ‡¦', type:'Ciutat' },
    { name:'Vancouver',      country:'CanadÃ ',         countryCode:'CA', flag:'ðŸ‡¨ðŸ‡¦', type:'Natura' },
    { name:'Montreal',       country:'CanadÃ ',         countryCode:'CA', flag:'ðŸ‡¨ðŸ‡¦', type:'Cultura' },
    { name:'CancÃºn',         country:'MÃ¨xic',          countryCode:'MX', flag:'ðŸ‡²ðŸ‡½', type:'Platja' },
    { name:'Ciutat de MÃ¨xic',country:'MÃ¨xic',          countryCode:'MX', flag:'ðŸ‡²ðŸ‡½', type:'Cultura' },
    { name:'Guadalajara',    country:'MÃ¨xic',          countryCode:'MX', flag:'ðŸ‡²ðŸ‡½', type:'Cultura' },
    { name:'La Havana',      country:'Cuba',           countryCode:'CU', flag:'ðŸ‡¨ðŸ‡º', type:'Cultura' },
    { name:'Cartagena',      country:'ColÃ²mbia',       countryCode:'CO', flag:'ðŸ‡¨ðŸ‡´', type:'Platja' },
    { name:'MedellÃ­n',       country:'ColÃ²mbia',       countryCode:'CO', flag:'ðŸ‡¨ðŸ‡´', type:'Cultura' },
    { name:'BogotÃ ',         country:'ColÃ²mbia',       countryCode:'CO', flag:'ðŸ‡¨ðŸ‡´', type:'Cultura' },
    { name:'Buenos Aires',   country:'Argentina',      countryCode:'AR', flag:'ðŸ‡¦ðŸ‡·', type:'Cultura' },
    { name:'PatagÃ²nia',      country:'Argentina',      countryCode:'AR', flag:'ðŸ‡¦ðŸ‡·', type:'Natura' },
    { name:'Rio de Janeiro', country:'Brasil',         countryCode:'BR', flag:'ðŸ‡§ðŸ‡·', type:'Platja' },
    { name:'SÃ£o Paulo',      country:'Brasil',         countryCode:'BR', flag:'ðŸ‡§ðŸ‡·', type:'Ciutat' },
    { name:'Salvador',       country:'Brasil',         countryCode:'BR', flag:'ðŸ‡§ðŸ‡·', type:'Platja' },
    { name:'Lima',           country:'PerÃº',           countryCode:'PE', flag:'ðŸ‡µðŸ‡ª', type:'Cultura' },
    { name:'Cusco',          country:'PerÃº',           countryCode:'PE', flag:'ðŸ‡µðŸ‡ª', type:'Natura' },
    { name:'Santiago',       country:'Xile',           countryCode:'CL', flag:'ðŸ‡¨ðŸ‡±', type:'Natura' },
    { name:'Punta Arenas',   country:'Xile',           countryCode:'CL', flag:'ðŸ‡¨ðŸ‡±', type:'Natura' },
    { name:'Quito',          country:'Equador',        countryCode:'EC', flag:'ðŸ‡ªðŸ‡¨', type:'Natura' },
    { name:'GalÃ¡pagos',      country:'Equador',        countryCode:'EC', flag:'ðŸ‡ªðŸ‡¨', type:'Natura' },
    { name:'San JosÃ©',       country:'Costa Rica',     countryCode:'CR', flag:'ðŸ‡¨ðŸ‡·', type:'Natura' },
    { name:'Punta Cana',     country:'Rep. Dominicana',countryCode:'DO', flag:'ðŸ‡©ðŸ‡´', type:'Platja' },
    // Oceania
    { name:'Sydney',         country:'AustrÃ lia',      countryCode:'AU', flag:'ðŸ‡¦ðŸ‡º', type:'Platja' },
    { name:'Melbourne',      country:'AustrÃ lia',      countryCode:'AU', flag:'ðŸ‡¦ðŸ‡º', type:'Cultura' },
    { name:'Cairns',         country:'AustrÃ lia',      countryCode:'AU', flag:'ðŸ‡¦ðŸ‡º', type:'Natura' },
    { name:'Auckland',       country:'Nova Zelanda',   countryCode:'NZ', flag:'ðŸ‡³ðŸ‡¿', type:'Natura' },
    { name:'Queenstown',     country:'Nova Zelanda',   countryCode:'NZ', flag:'ðŸ‡³ðŸ‡¿', type:'Aventura' },
    { name:'Fiji',           country:'Fiji',           countryCode:'FJ', flag:'ðŸ‡«ðŸ‡¯', type:'Illa' },
    { name:'Bora Bora',      country:'PolinÃ¨sia Francesa',countryCode:'PF',flag:'ðŸ‡µðŸ‡«',type:'Illa' },
]

// Elimina duplicats per nom+codi
const DESTINATIONS = POPULAR.filter((d, i, arr) =>
    arr.findIndex(x => x.name === d.name && x.countryCode === d.countryCode) === i
)

// Destins destacats per mostrar per defecte
const FEATURED = ['Barcelona','ParÃ­s','Bali','TÃ²quio','MarrÃ queix','Roma','Bangkok','Nova York']
    .map(n => DESTINATIONS.find(d => d.name === n)).filter(Boolean)


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
        <div className="position-relative">
            {selected ? (
                <div className="alert alert-info border-info rounded-4 d-flex align-items-center gap-2 py-2 mb-0">
                    <span className="badge text-bg-secondary text-white border-0">Desti</span>
                    <span className="flex-grow-1 text-truncate text-dark">{query}</span>
                    <span className="badge rounded-pill text-bg-success text-white">
            {selected.type}
          </span>
                    <button type="button" className="btn btn-sm btn-outline-info text-dark rounded-pill" onClick={handleClear}>Canviar</button>
                </div>
            ) : (
                <div className="input-group">
                    <span className="input-group-text bg-info bg-opacity-10 text-primary border-info">Desti</span>
                    <input
                        ref={inputRef}
                        className="form-control border-info"
                        type="text"
                        value={query}
                        onChange={handleInput}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                        placeholder="Cerca una ciutat, pais o tipus de desti..."
                        autoComplete="off"
                        required={required}
                    />
                    {query && (
                        <button type="button" className="btn btn-outline-info text-dark" onClick={handleClear}>Canviar</button>
                    )}
                </div>
            )}

            {open && results.length > 0 && !selected && (
                <div className="dropdown-menu show w-100 mt-2 p-0 shadow-sm border-info border-opacity-25 rounded-4 overflow-auto" ref={dropRef}>
                    <div className="dropdown-header">
                        {showFeatured ? 'Destins destacats' : results.length + ' resultats'}
                    </div>
                    {results.map((item, i) => (
                        <button
                            key={`${item.name}-${item.countryCode}-${i}`}
                            type="button"
                            className={`dropdown-item d-flex align-items-center gap-2 ${i === activeIdx ? 'active' : ''}`}
                            onClick={() => handleSelect(item)}
                        >
                            <span className="badge text-bg-secondary text-white border-0">{item.countryCode}</span>
                            <div className="flex-grow-1 text-truncate">
                                <div className="fw-semibold text-truncate text-primary">{item.name}</div>
                                <div className="small text-body-secondary">{item.country}</div>
                            </div>
                            <span className="badge rounded-pill text-bg-success border-0">{item.type}</span>
                        </button>
                    ))}
                </div>
            )}

            {open && results.length === 0 && query.length > 1 && !selected && (
                <div className="dropdown-menu show w-100 mt-2 p-0 shadow overflow-auto" ref={dropRef}>
                    <div className="text-center text-body-secondary p-3">
                        <div className="fs-6 fw-semibold mb-1">Sense resultats</div>
                        No trobat. Escriu-lo manualment i prem Enter.
                    </div>
                </div>
            )}
        </div>
    )
}





