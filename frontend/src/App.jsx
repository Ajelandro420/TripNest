import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Trips from "./pages/Trips";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

function App() {
    const isLoggedIn = !!localStorage.getItem("token"); // ejemplo básico

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/trips" element={<Trips />} />
                <Route path="/profile" element={isLoggedIn ? <Profile /> : <Login />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
