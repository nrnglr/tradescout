import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // Dashboard import
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import { ReturnPolicy, Privacy, SalesAgreement, About, TermsOfUse } from './pages/Terms';

function App() {
  return (
    <GoogleOAuthProvider clientId="409416631532-mu8gjhj2cv08mvuriqonb714av36crcg.apps.googleusercontent.com">
      <CartProvider>
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

            {/* Yasal Sayfalar */}
            <Route path="/iade-politikasi" element={<ReturnPolicy />} />
            <Route path="/gizlilik" element={<Privacy />} />
            <Route path="/mesafeli-satis" element={<SalesAgreement />} />
            <Route path="/hakkimizda" element={<About />} />
            <Route path="/kullanim-sartlari" element={<TermsOfUse />} />
          </Routes>
          <CartDrawer />
        </Router>
      </CartProvider>
    </GoogleOAuthProvider>
  );
}

export default App;