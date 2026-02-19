import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const isLoggedIn = false;

    return (
        <nav className="navbar">
            <div className="logo">Tripnest</div>

            <div className="nav-links">
                <Link to="/">Inicio</Link>
                <Link to="/trips">Viajes</Link>

                {isLoggedIn ? (
                    <Link to="/dashboard">Dashboard</Link>
                ) : (
                    <Link to="/login" className="btn-login">Login</Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
