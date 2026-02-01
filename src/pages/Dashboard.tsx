import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  InputAdornment,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';

// İkonlar
import SearchIcon from '@mui/icons-material/Search';
import PublicIcon from '@mui/icons-material/Public'; // Ülke için
import LocationCityIcon from '@mui/icons-material/LocationCity'; // Şehir için
import LanguageIcon from '@mui/icons-material/Language'; // Dil için
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'; // Ürün için
import DownloadIcon from '@mui/icons-material/Download'; // Excel için
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BoltIcon from '@mui/icons-material/Bolt'; // Kredi ikonu

import { authService } from '../services/auth';

// --- STİLLER (Mavi tema ağırlıklı) ---
const BRAND_COLORS = {
  primary: '#1565C0',
  primaryHover: '#0D47A1',
  secondary: '#1976D2',
  lightBlue: '#42A5F5',
  bgLight: '#E3F2FD', // Açık mavi arka plan
  bgGradient: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
  success: '#2E7D32', // Excel butonu için yeşil
  cardBg: '#FFFFFF',
};

const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: BRAND_COLORS.bgGradient,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '300px',
    background: 'linear-gradient(180deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)',
    zIndex: 0,
  }
});

const StyledAppBar = styled(AppBar)({
  backgroundColor: 'rgba(21, 101, 192, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(21, 101, 192, 0.3)',
  color: '#FFFFFF',
});

const SearchCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(21, 101, 192, 0.15)',
  marginTop: theme.spacing(4),
  backgroundColor: BRAND_COLORS.cardBg,
  border: '1px solid rgba(21, 101, 192, 0.1)',
  position: 'relative',
  zIndex: 1,
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#F8F9FA',
    transition: 'all 0.3s ease',
    '& fieldset': { 
      borderColor: '#BBDEFB',
      borderWidth: 2,
    },
    '&:hover fieldset': { 
      borderColor: BRAND_COLORS.primary,
      borderWidth: 2,
    },
    '&.Mui-focused fieldset': { 
      borderColor: BRAND_COLORS.primary,
      borderWidth: 2,
      boxShadow: '0 0 0 3px rgba(21, 101, 192, 0.1)',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: BRAND_COLORS.primary,
    fontWeight: 600,
  },
});

const ActionButton = styled(Button)(({ bgcolor = BRAND_COLORS.primary }: { bgcolor?: string }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
  boxShadow: bgcolor === BRAND_COLORS.success 
    ? '0 4px 10px rgba(46, 125, 50, 0.3)' 
    : '0 4px 10px rgba(21, 101, 192, 0.3)',
  backgroundColor: bgcolor,
  color: '#fff',
  '&:hover': {
    backgroundColor: bgcolor === BRAND_COLORS.success ? '#1B5E20' : BRAND_COLORS.primaryHover,
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
  },
  transition: 'all 0.2s ease',
}));

// --- COMPONENT ---

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Arama State'leri
  const [searchParams, setSearchParams] = useState({
    country: '',
    city: '',
    language: '',
    product: ''
  });

  // Sayfa yüklendiğinde kullanıcıyı çek
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Kullanıcı yoksa Login'e at (Güvenlik)
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = () => {
    console.log("Arama yapılıyor...", searchParams);
    // Buraya ileride API isteği gelecek
    alert(`Arama Başlatıldı: ${searchParams.product} - ${searchParams.country}`);
  };

  const handleExport = () => {
    console.log("Excel'e aktarılıyor...");
    alert("Veriler Excel formatında hazırlanıyor...");
  };

  return (
    <PageContainer>
      {/* --- HEADER (Navbar) --- */}
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Typography 
              variant="h5" 
              fontWeight="800" 
              sx={{ 
                color: '#FFFFFF',
                cursor: 'pointer',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
              onClick={() => navigate('/')}
            >
              Fortex Globe Search
            </Typography>

            {/* Sağ Taraf: Kredi ve Profil */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Kredi Göstergesi */}
              <Chip 
                icon={<BoltIcon sx={{ color: '#FFC107 !important' }} />} 
                label={`${user?.credits || 0} Kredi`} 
                sx={{ 
                  fontWeight: 'bold', 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  color: '#FFFFFF',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  height: 40,
                  borderRadius: '10px',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                  }
                }} 
              />

              {/* Profil Menüsü */}
              <Tooltip title="Hesap Ayarları">
                <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: BRAND_COLORS.primary }}>
                    {user?.fullName?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profilim</MenuItem>
                <MenuItem onClick={handleClose}>Paket Yükselt</MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Çıkış Yap
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* --- ANA İÇERİK --- */}
      <Container maxWidth="lg" sx={{ mt: 6, pb: 8, position: 'relative', zIndex: 1 }}>
        
        {/* Karşılama Başlığı */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Merhaba, {user?.fullName?.split(' ')[0] || 'Gezgin'} 👋
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mt: 1 }}>
            Bugün hangi pazarı keşfetmek istiyorsun?
          </Typography>
        </Box>

        {/* Arama Paneli (Beyaz Kart) */}
        <SearchCard elevation={3}>
          <Typography variant="h6" fontWeight="bold" mb={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <SearchIcon sx={{ mr: 1, color: BRAND_COLORS.primary }} />
            Hedef Pazar Araması
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 1. Ürün İsmi (En önemlisi, geniş olsun) */}
            <Box sx={{ width: '100%' }}>
              <StyledTextField
                fullWidth
                label="Ne satıyorsunuz? (Ürün İsmi)"
                placeholder="Örn: Tekstil, Zeytinyağı, Mobilya..."
                value={searchParams.product}
                onChange={(e) => setSearchParams({...searchParams, product: e.target.value})}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShoppingBagIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* 2-4. Ülke, Şehir, Dil */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {/* 2. Ülke */}
              <Box sx={{ flex: '1 1 300px' }}>
                <StyledTextField
                  fullWidth
                  label="Hedef Ülke"
                  placeholder="Örn: Almanya"
                  value={searchParams.country}
                  onChange={(e) => setSearchParams({...searchParams, country: e.target.value})}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PublicIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* 3. Şehir */}
              <Box sx={{ flex: '1 1 300px' }}>
                <StyledTextField
                  fullWidth
                  label="Hedef Şehir"
                  placeholder="Örn: Berlin (Opsiyonel)"
                  value={searchParams.city}
                  onChange={(e) => setSearchParams({...searchParams, city: e.target.value})}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationCityIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* 4. Dil */}
              <Box sx={{ flex: '1 1 300px' }}>
                <StyledTextField
                  fullWidth
                  label="Dil"
                  placeholder="Örn: İngilizce, Almanca"
                  value={searchParams.language}
                  onChange={(e) => setSearchParams({...searchParams, language: e.target.value})}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LanguageIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            {/* BUTONLAR */}
            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
               {/* Excel Butonu (Sadece sonuç varsa aktif olur, şimdilik aktif) */}
               <ActionButton 
                variant="contained" 
                bgcolor={BRAND_COLORS.success}
                onClick={handleExport}
                startIcon={<DownloadIcon />}
              >
                Excel'e Aktar
              </ActionButton>

              {/* Ara Butonu */}
              <ActionButton 
                variant="contained" 
                bgcolor={BRAND_COLORS.primary}
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{ px: 6 }} // Daha geniş buton
              >
                Firma Ara
              </ActionButton>
            </Box>
          </Box>
        </SearchCard>

        {/* Sonuç Alanı (Placeholder - Boşken güzel görünsün diye) */}
        <Box sx={{ 
          mt: 6, 
          textAlign: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          p: 6,
          border: '1px solid rgba(21, 101, 192, 0.1)',
          boxShadow: '0 4px 20px rgba(21, 101, 192, 0.08)',
          transition: 'all 0.3s ease',
        }}>
          <Box sx={{ 
            width: 120, 
            height: 120, 
            borderRadius: '50%', 
            bgcolor: 'rgba(21, 101, 192, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 3,
          }}>
            <SearchIcon sx={{ fontSize: 60, color: BRAND_COLORS.primary, opacity: 0.5 }} />
          </Box>
          
          <Typography variant="h5" fontWeight="600" sx={{ color: BRAND_COLORS.primary, mb: 2 }}>
            Henüz Arama Yapılmadı
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '500px', margin: '0 auto', lineHeight: 1.8 }}>
            Kriterlerinizi yukarıdaki formu kullanarak girin ve <strong>"Firma Ara"</strong> butonuna basarak potansiyel müşterilerinizi listeleyin.
          </Typography>
          
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: BRAND_COLORS.primary }}>
              <PublicIcon sx={{ fontSize: 20 }} />
              <Typography variant="body2" fontWeight="500">Global Erişim</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: BRAND_COLORS.primary }}>
              <ShoppingBagIcon sx={{ fontSize: 20 }} />
              <Typography variant="body2" fontWeight="500">Sektör Bazlı</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: BRAND_COLORS.primary }}>
              <DownloadIcon sx={{ fontSize: 20 }} />
              <Typography variant="body2" fontWeight="500">Excel İndirme</Typography>
            </Box>
          </Box>
        </Box>

      </Container>
    </PageContainer>
  );
};

export default Dashboard;