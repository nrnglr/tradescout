import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // Dashboard import

function App() {
  return (
    <Router>
      <Routes>
        {/* Ana Sayfa (Landing Page) - Site açılınca burası gelecek */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Login Sayfası - Butona basınca buraya gidecek */}
        <Route path="/login" element={<Login />} />
        
        {/* Kayıt Ol Sayfası */}
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard - Kullanıcı giriş yaptıktan sonra */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;