import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import OAuth2Redirect from './pages/OAuth2Redirect';
import Admin from './pages/Admin';
import UserActivities from './pages/UserActivities';

function App() {
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/user/:userId" element={<UserActivities />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/oauth2/redirect" element={<OAuth2Redirect />} /> {/* НОВЫЙ РОУТ */}
            </Routes>
        </Router>
    );
}

export default App;