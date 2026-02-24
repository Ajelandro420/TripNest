import { BrowserRouter } from 'react-router-dom'
import { AuthProvider }  from '../public/context/AuthContext.jsx'
import Navbar            from './components/Layout/Navbar'
import Footer            from './components/Layout/Footer'
import AppRoutes         from './routes/AppRoutes'

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                {/* Skip to content — WCAG 2.1 AA 2.4.1 */}
                <a href="#main-content" className="skip-to-content">
                    Saltar al contingut principal
                </a>

                <Navbar />

                {/* main landmark — WCAG semantic HTML */}
                <main id="main-content">
                    <AppRoutes />
                </main>

                <Footer />
            </BrowserRouter>
        </AuthProvider>
    )
}