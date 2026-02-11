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
  Tooltip,
  Alert,
  AlertTitle
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
import BusinessIcon from '@mui/icons-material/Business'; // Firma sayısı için
import ConstructionIcon from '@mui/icons-material/Construction'; // Yapım ikonu
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'; // Hediye ikonu

import { authService } from '../services/auth';
import { scraperService, Business, ScrapeResponse } from '../services/scraper';
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
    country: 'Türkiye',
    city: '',
    language: 'tr',
    product: '',
    companyCount: '10'
  });

  // Scraping her zaman Gemini AI ile yapılacak (kullanıcıya gösterilmez)
  const scrapingMethod = 'gemini';

  // Loading ve Sonuç State'leri
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ScrapeResponse | null>(null);
  const [error, setError] = useState<string>('');

  // Sayfa yüklendiğinde kullanıcıyı çek
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    console.log('🔍 Dashboard Debug:');
    console.log('Token var mı?', !!token);
    console.log('User var mı?', !!storedUser);
    console.log('Token:', token ? `${token.substring(0, 20)}...` : 'YOK');
    console.log('User:', storedUser);
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      // Kullanıcı yoksa Login'e at (Güvenlik)
      console.warn('⚠️ Token veya user bulunamadı, login sayfasına yönlendiriliyor...');
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

  const handleSearch = async () => {
    console.log('🔍 Firma Ara başlatıldı');
    console.log('Token mevcut mu?', !!localStorage.getItem('token'));
    console.log('User mevcut mu?', !!localStorage.getItem('user'));
    
    const token = localStorage.getItem('token');
    console.log('🔑 Token değeri:', token);
    console.log('🔑 Token uzunluğu:', token?.length);
    console.log('🔑 Token ilk 50 karakter:', token?.substring(0, 50));
    
    // Validasyon
    if (!searchParams.product.trim()) {
      setError('Lütfen ürün ismi girin!');
      return;
    }
    if (!searchParams.city.trim()) {
      setError('Lütfen şehir girin!');
      return;
    }
    
    const companyCount = parseInt(searchParams.companyCount);
    if (companyCount < 1 || companyCount > 100) {
      setError('Firma sayısı 1-100 arasında olmalıdır!');
      return;
    }

    setError('');
    setIsLoading(true);
    setSearchResults(null);

    try {
      // Kredi kontrolü
      const availableCredits = user?.credits || 0;
      if (availableCredits < companyCount) {
        setError(`Yetersiz kredi! Gerekli: ${companyCount}, Mevcut: ${availableCredits}`);
        setIsLoading(false);
        return;
      }

      console.log('📡 API isteği gönderiliyor...');
      console.log('Parametreler:', {
        category: searchParams.product,
        city: searchParams.city,
        country: searchParams.country || 'Türkiye',
        language: searchParams.language || 'tr',
        maxResults: companyCount,
      });

      // API isteği - Arka planda Gemini AI ile otomatik arama
      console.log('� Firmalar aranıyor...');
      const response = await scraperService.scrape({
        category: searchParams.product,
        city: searchParams.city,
        country: searchParams.country || 'Türkiye',
        language: searchParams.language || 'tr',
        maxResults: companyCount,
      });

      console.log('✅ API isteği başarılı:', response);
      setSearchResults(response);
      
      // Kullanıcının kredi bilgisini güncelle
      const updatedUser = { ...user, credits: (user?.credits || 0) - response.creditsUsed };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

    } catch (err: any) {
      console.error('❌ Arama hatası:', err);
      console.error('Hata detayı:', {
        response: err.response,
        request: err.request,
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      
      // Axios hata mesajını doğru şekilde yakala
      if (err.response) {
        // Backend'den gelen hata mesajı
        const errorMessage = err.response.data?.message || err.response.data?.error || 'Bir hata oluştu';
        setError(errorMessage);
        
        // Hata mesajına scroll yap
        setTimeout(() => {
          document.getElementById('error-message')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        
        // 401 hatası için özel durum
        if (err.response.status === 401) {
          setError('⚠️ Oturumunuz sona erdi. 3 saniye içinde giriş sayfasına yönlendirileceksiniz...');
          // 3 saniye bekle ki kullanıcı mesajı görebilsin
          setTimeout(() => {
            authService.logout();
            navigate('/login');
          }, 3000);
        }
      } else if (err.request) {
        // İstek gönderildi ama cevap alınamadı (network hatası)
        setError('❌ Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.');
        setTimeout(() => {
          document.getElementById('error-message')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else {
        // Başka bir hata
        setError(err.message || '❌ Bir hata oluştu. Lütfen tekrar deneyin.');
        setTimeout(() => {
          document.getElementById('error-message')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (searchResults) {
      scraperService.downloadExcel(searchResults.jobId);
    }
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
                gap: { xs: 1, sm: 1.5 }, 
                cursor: 'pointer' 
              }}
              onClick={() => navigate('/')}
            >
              <Box
                component="img"
                src={logoImage}
                alt="FGS Logo"
                sx={{
                  height: { xs: 60, sm: 65, md: 70 },
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
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' }
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

        {/* Yapım Aşaması & Erken Yatırım Bildirimi */}
        <Alert 
          severity="info" 
          icon={<ConstructionIcon fontSize="large" />}
          sx={{ 
            mb: 3,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(227, 242, 253, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
            border: '2px solid #42A5F5',
            boxShadow: '0 8px 24px rgba(21, 101, 192, 0.2)',
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { 
                boxShadow: '0 8px 24px rgba(21, 101, 192, 0.2)',
              },
              '50%': { 
                boxShadow: '0 8px 32px rgba(21, 101, 192, 0.4)',
              }
            },
            '& .MuiAlert-icon': {
              color: BRAND_COLORS.primary,
              fontSize: '2rem'
            }
          }}
        >
          <AlertTitle sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem' }, color: BRAND_COLORS.primary }}>
            Platform Yapım Aşamasında
          </AlertTitle>
          <Box sx={{ mt: 1.5 }}>
            <Typography variant="body1" sx={{ mb: 2, color: '#333', lineHeight: 1.6, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              FGS TRADE platformu aktif olarak geliştirilmektedir. Bazı özellikler beta aşamasındadır ve zaman zaman kesintiler yaşanabilir.
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 1.5, 
                bgcolor: 'rgba(255, 193, 7, 0.15)', 
                p: { xs: 2, sm: 2.5 }, 
                borderRadius: '12px',
                border: '2px solid #FFC107',
                mt: 2
              }}
            >
              <CardGiftcardIcon sx={{ color: '#F57C00', fontSize: { xs: 32, sm: 36 }, flexShrink: 0 }} />
              <Box>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#E65100', fontSize: { xs: '0.95rem', sm: '1.05rem' } }}>
                  🎁 Erken Yatırımcılara Özel Fırsat!
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 0.5, fontSize: { xs: '0.85rem', sm: '0.9rem' }, lineHeight: 1.5 }}>
                  Beta döneminde paket satın alan tüm kullanıcılara, platform resmi olarak yayınlandığında <strong>%50 bonus kredi</strong> hediye edilecektir! 🚀
                </Typography>
              </Box>
            </Box>
          </Box>
        </Alert>

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

              {/* 5. Firma Sayısı */}
              <Box sx={{ flex: '1 1 100%', minWidth: { sm: '250px', md: '300px' } }}>
                <StyledTextField
                  fullWidth
                  type="number"
                  label="Kaç Firma Aranacak?"
                  placeholder="Örn: 10, 50, 100..."
                  value={searchParams.companyCount}
                  onChange={(e) => setSearchParams({...searchParams, companyCount: e.target.value})}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="action" />
                      </InputAdornment>
                    ),
                    inputProps: { min: 1, max: 1000 }
                  }}
                  helperText="En az 1, en fazla 1000 firma"
                />
              </Box>
            </Box>



            {/* Hata Mesajı */}
            {error && (
              <Box 
                id="error-message"
                sx={{ 
                  mt: 2, 
                  p: 2.5, 
                  bgcolor: '#ffebee', 
                  borderRadius: '12px',
                  border: '2px solid #ef5350',
                  boxShadow: '0 4px 12px rgba(239, 83, 80, 0.3)',
                  animation: 'shake 0.5s',
                  '@keyframes shake': {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-10px)' },
                    '75%': { transform: 'translateX(10px)' }
                  }
                }}
              >
                <Typography sx={{ color: '#c62828', fontWeight: 600, fontSize: '1rem' }}>
                  {error}
                </Typography>
              </Box>
            )}

            {/* Loading Mesajı */}
            {isLoading && (
              <Box sx={{ 
                mt: 2, 
                p: 3, 
                bgcolor: '#e3f2fd', 
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <Typography sx={{ color: '#1565C0', fontWeight: 600, mb: 1 }}>
                  🔍 Firmalar aranıyor...
                </Typography>
                <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
                  Bu işlem birkaç dakika sürebilir. Lütfen bekleyiniz.
                </Typography>
              </Box>
            )}

            {/* BUTONLAR */}
            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: { xs: 'center', sm: 'flex-end' }, flexWrap: 'wrap' }}>
               {/* Excel Butonu (Sadece sonuç varsa aktif) */}
               <ExcelButton 
                variant="contained" 
                onClick={handleExport}
                startIcon={<DownloadIcon />}
                disabled={!searchResults || isLoading}
              >
                Excel'e Aktar
              </ExcelButton>

              {/* Ara Butonu */}
              <ActionButton 
                variant="contained" 
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                disabled={isLoading}
                sx={{ px: { xs: 3, sm: 6 } }}
              >
                {isLoading ? 'Aranıyor...' : 'Firma Ara'}
              </ActionButton>
            </Box>
          </Box>
        </SearchCard>

        {/* Sonuç Alanı */}
        {searchResults ? (
          <Box sx={{ 
            mt: { xs: 4, sm: 5, md: 6 }, 
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: { xs: '16px', sm: '20px' },
            p: { xs: 3, sm: 4 },
            border: '1px solid rgba(21, 101, 192, 0.2)',
            boxShadow: '0 8px 32px rgba(21, 101, 192, 0.15)',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: BRAND_COLORS.primary }}>
                ✅ {searchResults.totalResults} Firma Bulundu!
              </Typography>
              <Chip 
                label={`${searchResults.creditsUsed} kredi kullanıldı`}
                sx={{ 
                  bgcolor: '#4caf50', 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              />
            </Box>

            <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
              {searchResults.message}
            </Typography>

            {/* Firma Listesi */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {searchResults.businesses.slice(0, 5).map((business, index) => (
                <Paper 
                  key={index}
                  sx={{ 
                    p: 2, 
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ color: BRAND_COLORS.primary, mb: 1 }}>
                    {business.businessName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                    📍 {business.address}
                  </Typography>
                  {business.phone && (
                    <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                      📞 {business.phone}
                    </Typography>
                  )}
                  {business.website && (
                    <Typography 
                      variant="body2" 
                      component="a"
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: '#1976d2', textDecoration: 'none', mb: 0.5, display: 'block' }}
                    >
                      🌐 {business.website}
                    </Typography>
                  )}
                  {business.rating > 0 && (
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      ⭐ {business.rating} ({business.reviewCount} değerlendirme)
                    </Typography>
                  )}
                </Paper>
              ))}
            </Box>

            {searchResults.businesses.length > 5 && (
              <Typography variant="body2" sx={{ color: '#666', mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
                ... ve {searchResults.businesses.length - 5} firma daha. Tüm firmalar için Excel'i indirin.
              </Typography>
            )}

            {/* Excel İndirme Butonu */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <ExcelButton 
                variant="contained"
                onClick={handleExport}
                startIcon={<DownloadIcon />}
                sx={{ fontSize: '1rem', py: 1.5, px: 4 }}
              >
                📥 Excel Dosyasını İndir
              </ExcelButton>
            </Box>
          </Box>
        ) : (
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
        )}

      </Container>
    </PageContainer>
  );
};

export default Dashboard;