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
import BoltIcon from '@mui/icons-material/Bolt'; // Kredi ikonu

import { authService } from '../services/auth';
// Logo import - FGSTrade
import logoImage from '../assent/fgs-logo.png';

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
  background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.98) 0%, rgba(227, 242, 253, 0.95) 15%, rgba(21, 101, 192, 0.95) 35%, rgba(21, 101, 192, 0.95) 100%)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
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
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
    borderRadius: '16px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: '12px',
    marginTop: theme.spacing(2),
  },
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

const ActionButton = styled(Button)(({ theme }: { theme?: any }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
  boxShadow: '0 4px 10px rgba(21, 101, 192, 0.3)',
  backgroundColor: BRAND_COLORS.primary,
  color: '#fff',
  '&:hover': {
    backgroundColor: BRAND_COLORS.primaryHover,
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
  },
  transition: 'all 0.2s ease',
  [theme?.breakpoints.down('sm')]: {
    padding: '10px 16px',
    fontSize: '0.9rem',
    width: '100%',
  },
}));

const ExcelButton = styled(Button)(({ theme }: { theme?: any }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
  boxShadow: '0 4px 10px rgba(46, 125, 50, 0.3)',
  backgroundColor: BRAND_COLORS.success,
  color: '#fff',
  '&:hover': {
    backgroundColor: '#1B5E20',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
  },
  transition: 'all 0.2s ease',
  [theme?.breakpoints.down('sm')]: {
    padding: '10px 16px',
    fontSize: '0.9rem',
    width: '100%',
  },
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
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 64 } }}>
            {/* Logo ve Başlık */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                cursor: 'pointer' 
              }}
              onClick={() => navigate('/')}
            >
              <Box
                component="img"
                src={logoImage}
                alt="FGS Logo"
                sx={{
                  height: { xs: 50, sm: 55, md: 60 },
                  width: 'auto',
                  borderRadius: '8px',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              />
              <Typography 
                variant="h5" 
                fontWeight="800" 
                sx={{ 
                  color: '#1565C0',
                  textShadow: '0 1px 2px rgba(255,255,255,0.3)',
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.4rem' },
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                FGS Trade
              </Typography>
            </Box>

            {/* Sağ Taraf: Kredi ve Profil */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              {/* Kredi Göstergesi */}
              <Chip 
                icon={<BoltIcon sx={{ color: '#FFC107 !important' }} />} 
                label={`${user?.credits || 0} Kredi`} 
                sx={{ 
                  fontWeight: 'bold', 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  color: '#FFFFFF',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  height: { xs: 32, sm: 40 },
                  borderRadius: '10px',
                  backdropFilter: 'blur(10px)',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                  }
                }} 
              />

              {/* Profil Menüsü */}
              <Tooltip title="Hesap Ayarları">
                <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: BRAND_COLORS.primary, width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }}>
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
      <Container maxWidth="lg" sx={{ mt: { xs: 3, sm: 4, md: 6 }, pb: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1 }}>
        
        {/* Karşılama Başlığı */}
        <Box mb={{ xs: 2, sm: 3, md: 4 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.3)', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
            Merhaba, {user?.fullName?.split(' ')[0] || 'Gezgin'} 👋
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mt: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            Bugün hangi pazarı keşfetmek istiyorsun?
          </Typography>
        </Box>

        {/* Arama Paneli (Beyaz Kart) */}
        <SearchCard elevation={3}>
          <Typography variant="h6" fontWeight="bold" mb={3} sx={{ display: 'flex', alignItems: 'center', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            <SearchIcon sx={{ mr: 1, color: BRAND_COLORS.primary }} />
            Hedef Pazar Araması
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
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
            <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
              {/* 2. Ülke */}
              <Box sx={{ flex: '1 1 100%', minWidth: { sm: '250px', md: '300px' } }}>
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
              <Box sx={{ flex: '1 1 100%', minWidth: { sm: '250px', md: '300px' } }}>
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
              <Box sx={{ flex: '1 1 100%', minWidth: { sm: '250px', md: '300px' } }}>
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
            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: { xs: 'center', sm: 'flex-end' }, flexWrap: 'wrap' }}>
               {/* Excel Butonu (Sadece sonuç varsa aktif olur, şimdilik aktif) */}
               <ExcelButton 
                variant="contained" 
                onClick={handleExport}
                startIcon={<DownloadIcon />}
              >
                Excel'e Aktar
              </ExcelButton>

              {/* Ara Butonu */}
              <ActionButton 
                variant="contained" 
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{ px: { xs: 3, sm: 6 } }} // Daha geniş buton
              >
                Firma Ara
              </ActionButton>
            </Box>
          </Box>
        </SearchCard>

        {/* Sonuç Alanı (Placeholder - Boşken güzel görünsün diye) */}
        <Box sx={{ 
          mt: { xs: 4, sm: 5, md: 6 }, 
          textAlign: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: { xs: '16px', sm: '20px' },
          p: { xs: 3, sm: 4, md: 6 },
          border: '1px solid rgba(21, 101, 192, 0.1)',
          boxShadow: '0 4px 20px rgba(21, 101, 192, 0.08)',
          transition: 'all 0.3s ease',
        }}>
          <Box sx={{ 
            width: { xs: 80, sm: 100, md: 120 }, 
            height: { xs: 80, sm: 100, md: 120 }, 
            borderRadius: '50%', 
            bgcolor: 'rgba(21, 101, 192, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: { xs: 2, sm: 3 },
          }}>
            <SearchIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 }, color: BRAND_COLORS.primary, opacity: 0.5 }} />
          </Box>
          
          <Typography variant="h5" fontWeight="600" sx={{ color: BRAND_COLORS.primary, mb: 2, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Henüz Arama Yapılmadı
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '500px', margin: '0 auto', lineHeight: 1.8, fontSize: { xs: '0.9rem', sm: '1rem' }, px: { xs: 2, sm: 0 } }}>
            Kriterlerinizi yukarıdaki formu kullanarak girin ve <strong>"Firma Ara"</strong> butonuna basarak potansiyel müşterilerinizi listeleyin.
          </Typography>
          
          <Box sx={{ mt: { xs: 3, sm: 4 }, display: 'flex', gap: { xs: 1.5, sm: 2 }, justifyContent: 'center', flexWrap: 'wrap', px: { xs: 1, sm: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: BRAND_COLORS.primary }}>
              <PublicIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <Typography variant="body2" fontWeight="500" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Global Erişim</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: BRAND_COLORS.primary }}>
              <ShoppingBagIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <Typography variant="body2" fontWeight="500" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Sektör Bazlı</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: BRAND_COLORS.primary }}>
              <DownloadIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <Typography variant="body2" fontWeight="500" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Excel İndirme</Typography>
            </Box>
          </Box>
        </Box>

      </Container>
    </PageContainer>
  );
};

export default Dashboard;