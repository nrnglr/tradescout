import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ana Sayfa (Landing Page) - Site açılınca burası gelecek */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Login Sayfası - Butona basınca buraya gidecek */}
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard (İleride yapacaksın) */}
        <Route path="/dashboard" element={<div>Dashboard Sayfası (Yapım Aşamasında)</div>} />
      </Routes>
    </Router>
  );
}

export default App;