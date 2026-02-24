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
  AlertTitle,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

// İkonlar
import SearchIcon from '@mui/icons-material/Search';
import PublicIcon from '@mui/icons-material/Public'; // Ülke için
import LanguageIcon from '@mui/icons-material/Language'; // Dil için
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'; // Ürün için
import DownloadIcon from '@mui/icons-material/Download'; // Excel için
import LogoutIcon from '@mui/icons-material/Logout';
import BoltIcon from '@mui/icons-material/Bolt'; // Kredi ikonu
import BusinessIcon from '@mui/icons-material/Business'; // Firma sayısı için
import ConstructionIcon from '@mui/icons-material/Construction'; // Yapım ikonu
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'; // Hediye ikonu

import { authService } from '../services/auth';
import { scraperService, ScrapeResponse } from '../services/scraper';
import { useLanguage } from '../i18n/LanguageContext';
import { Country, State } from 'country-state-city';
// Logo import - FGSTrade
import logoImage from '../assent/fgs-logo.png';

// Tüm diller listesi
const ALL_LANGUAGES = [
  { code: 'tr', name: 'Türkçe', native: 'Türkçe' },
  { code: 'en', name: 'English', native: 'English' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'sv', name: 'Swedish', native: 'Svenska' },
  { code: 'no', name: 'Norwegian', native: 'Norsk' },
  { code: 'da', name: 'Danish', native: 'Dansk' },
  { code: 'fi', name: 'Finnish', native: 'Suomi' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά' },
  { code: 'cs', name: 'Czech', native: 'Čeština' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar' },
  { code: 'ro', name: 'Romanian', native: 'Română' },
  { code: 'bg', name: 'Bulgarian', native: 'Български' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська' },
  { code: 'he', name: 'Hebrew', native: 'עברית' },
  { code: 'th', name: 'Thai', native: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
];

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

const StyledFormControl = styled(FormControl)({
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
  const { language, t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Ülke ve Şehir State'leri
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  
  // Arama State'leri
  const [searchParams, setSearchParams] = useState({
    country: '',
    city: '',
    language: 'tr',
    product: '',
    companyCount: '10'
  });

  // Loading ve Sonuç State'leri
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ScrapeResponse | null>(null);
  const [error, setError] = useState<string>('');

  // Sayfa yüklendiğinde kullanıcıyı çek
  useEffect(() => {
    // Ülkeleri yükle
    const countryList = Country.getAllCountries().map(c => c.name);
    setCountries(countryList);
    
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      // Kullanıcı yoksa Login'e at (Güvenlik)
      navigate('/login');
    }
  }, [navigate]);

  // Ülke değiştiğinde şehirleri güncelle
  useEffect(() => {
    if (searchParams.country) {
      const countryData = Country.getAllCountries().find(c => c.name === searchParams.country);
      if (countryData) {
        const stateList = State.getStatesOfCountry(countryData.isoCode).map(s => s.name);
        setCities(stateList);
        setSearchParams(prev => ({ ...prev, city: '' })); // Şehri sıfırla
      }
    }
  }, [searchParams.country]);

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
    // Validasyon
    if (!searchParams.product.trim()) {
      setError(language === 'tr' ? 'Lütfen ürün ismi girin!' : 'Please enter a product name!');
      return;
    }
    if (!searchParams.country) {
      setError(language === 'tr' ? 'Lütfen ülke seçin!' : 'Please select a country!');
      return;
    }
    if (!searchParams.city) {
      setError(language === 'tr' ? 'Lütfen şehir seçin!' : 'Please select a city!');
      return;
    }
    
    const companyCount = parseInt(searchParams.companyCount);
    const isAdmin = user?.role?.toLowerCase() === 'admin';
    
    // Admin değilse firma sayısı kontrolü yap (Max 10)
    if (!isAdmin && (companyCount < 1 || companyCount > 10)) {
      setError(`⚠️ ${language === 'tr' ? 'Free pakette maksimum 10 firma aranabilir.' : 'Maximum 10 companies per search in free plan.'} ${language === 'tr' ? 'Daha fazla arama için paket yükseltin!' : 'Upgrade your package to search more!'}`);
      return;
    }
    
    // Admin ise sınır yok, normal kullanıcılar için minimum kontrol
    if (companyCount < 1) {
      setError(language === 'tr' ? 'Lütfen en az 1 firma seçin!' : 'Please select at least 1 company!');
      return;
    }

    setError('');
    setIsLoading(true);
    setSearchResults(null);

    try {
      // Kredi kontrolü (Admin için değil)
      const isAdmin = user?.role?.toLowerCase() === 'admin';
      const availableCredits = user?.credits || 0;
      
      // Her arama 1 kredi kullanıyor
      if (!isAdmin && availableCredits < 1) {
        setError(`${language === 'tr' ? '❌ Yetersiz kredi!' : '❌ Insufficient credits!'} ${language === 'tr' ? 'Mevcut' : 'Available'}: ${availableCredits}`);
        setIsLoading(false);
        return;
      }

      // API isteği - Arka planda Gemini AI ile otomatik arama
      const response = await scraperService.scrape({
        category: searchParams.product,
        city: searchParams.city,
        country: searchParams.country || 'Türkiye',
        language: searchParams.language || 'tr',
        maxResults: companyCount,
      });

      setSearchResults(response);
      
      // Kullanıcının kredi bilgisini güncelle - Her arama 1 kredi düşer (companyCount değil)
      const updatedUser = { ...user, credits: (user?.credits || 0) - 1 };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

    } catch (err: any) {
      // Axios hata mesajını doğru şekilde yakala
      if (err.response) {
        // Backend'den gelen hata mesajı - Gemini detaylarını gösterme
        // Sadece genel bir hata mesajı göster
        if (err.response.status === 401) {
          setError(language === 'tr' ? '⚠️ Oturumunuz sona erdi. 3 saniye içinde giriş sayfasına yönlendirileceksiniz...' : '⚠️ Your session has expired. You will be redirected to login in 3 seconds...');
          // 3 saniye bekle ki kullanıcı mesajı görebilsin
          setTimeout(() => {
            authService.logout();
            navigate('/login');
          }, 3000);
        } else {
          // Diğer hatalar için genel mesaj
          setError(language === 'tr' ? '❌ Arama başarısız oldu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.' : '❌ Search failed. Please check your information and try again.');
        }
        
        // Hata mesajına scroll yap
        setTimeout(() => {
          document.getElementById('error-message')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        
      } else if (err.request) {
        // İstek gönderildi ama cevap alınamadı (network hatası)
        setError(language === 'tr' ? '❌ Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.' : '❌ Cannot connect to server. Please check your internet connection.');
        setTimeout(() => {
          document.getElementById('error-message')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else {
        // Başka bir hata
        setError(language === 'tr' ? '❌ Arama başarısız oldu. Lütfen tekrar deneyin.' : '❌ Search failed. Please try again.');
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
      // Ürün ismini kullan (boşlukları alt çizgi ile değiştir)
      const productName = searchParams.product.trim().replace(/\s+/g, '_');
      scraperService.downloadExcel(searchResults.jobId, productName);
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
              {/* Kredi Göstergesi / Admin Badge */}
              {user?.role?.toLowerCase() === 'admin' ? (
                <Chip 
                  icon={<BoltIcon sx={{ color: '#FFD700 !important' }} />} 
                  label="🔑 Admin" 
                  sx={{ 
                    fontWeight: 'bold', 
                    bgcolor: 'rgba(255, 215, 0, 0.3)', 
                    color: '#FFD700',
                    border: '2px solid rgba(255, 215, 0, 0.6)',
                    height: { xs: 32, sm: 40 },
                    borderRadius: '10px',
                    backdropFilter: 'blur(10px)',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    '&:hover': {
                      bgcolor: 'rgba(255, 215, 0, 0.4)',
                    }
                  }} 
                />
              ) : (
                <Chip 
                  icon={<BoltIcon sx={{ color: '#FFC107 !important' }} />} 
                  label={`${user?.credits || 0} ${t('dashboard.credits')}`} 
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
              )}

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
                <MenuItem onClick={handleClose}>{t('dashboard.profile')}</MenuItem>
                <MenuItem onClick={handleClose}>{t('dashboard.upgrade')}</MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> {t('dashboard.logout')}
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
            {t('dashboard.greeting')}, {user?.fullName?.split(' ')[0] || 'Gezgin'} 👋
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mt: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            {t('dashboard.subtitle')}
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
            '& .MuiAlert-icon': {
              color: BRAND_COLORS.primary,
              fontSize: '2rem'
            }
          }}
        >
          <AlertTitle sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem' }, color: BRAND_COLORS.primary }}>
            {t('dashboard.notification.betaTitle')}
          </AlertTitle>
          <Box sx={{ mt: 1.5 }}>
            <Typography variant="body1" sx={{ mb: 2, color: '#333', lineHeight: 1.6, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              {t('dashboard.notification.betaDesc')}
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
                  🎁 {t('dashboard.notification.bonusTitle')}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 0.5, fontSize: { xs: '0.85rem', sm: '0.9rem' }, lineHeight: 1.5 }}>
                  {t('dashboard.notification.bonusDesc')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Alert>

        {/* Arama Paneli (Beyaz Kart) */}
        <SearchCard elevation={3}>
          <Typography variant="h6" fontWeight="bold" mb={3} sx={{ display: 'flex', alignItems: 'center', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            <SearchIcon sx={{ mr: 1, color: BRAND_COLORS.primary }} />
            {t('dashboard.search.title')}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
            {/* 1. Ürün İsmi (En önemlisi, geniş olsun) */}
            <Box sx={{ width: '100%' }}>
              <StyledTextField
                fullWidth
                label={t('dashboard.search.product')}
                placeholder={t('dashboard.search.productPlaceholder')}
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
              {/* 2. Ülke - Dropdown */}
              <Box sx={{ flex: '1 1 100%', minWidth: { sm: '250px', md: '300px' } }}>
                <StyledFormControl fullWidth>
                  <InputLabel>{t('dashboard.search.country')}</InputLabel>
                  <Select
                    label={t('dashboard.search.country')}
                    value={searchParams.country}
                    onChange={(e) => setSearchParams({...searchParams, country: e.target.value})}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Box>

              {/* 3. Şehir - Dropdown (Ülke seçildikten sonra aktif) */}
              <Box sx={{ flex: '1 1 100%', minWidth: { sm: '250px', md: '300px' } }}>
                <StyledFormControl fullWidth disabled={!searchParams.country}>
                  <InputLabel>{t('dashboard.search.city')}</InputLabel>
                  <Select
                    label={t('dashboard.search.city')}
                    value={searchParams.city}
                    onChange={(e) => setSearchParams({...searchParams, city: e.target.value})}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Box>

              {/* 4. Dil - Dropdown */}
              <Box sx={{ flex: '1 1 100%', minWidth: { sm: '250px', md: '300px' } }}>
                <StyledFormControl fullWidth>
                  <InputLabel>{t('dashboard.search.language')}</InputLabel>
                  <Select
                    label={t('dashboard.search.language')}
                    value={searchParams.language}
                    onChange={(e) => setSearchParams({...searchParams, language: e.target.value})}
                    startAdornment={
                      <InputAdornment position="start" sx={{ ml: 1 }}>
                        <LanguageIcon color="action" />
                      </InputAdornment>
                    }
                  >
                    {ALL_LANGUAGES.map((lang) => (
                      <MenuItem key={lang.code} value={lang.code}>
                        {lang.native} ({lang.name})
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Box>

              {/* 5. Firma Sayısı */}
              <Box sx={{ flex: '1 1 100%', minWidth: { sm: '250px', md: '300px' } }}>
                <StyledTextField
                  fullWidth
                  type="number"
                  label={t('dashboard.search.companyCount')}
                  placeholder={user?.role?.toLowerCase() === 'admin' ? "E.g: 50, 100, 500..." : "Maximum 10 companies"}
                  value={searchParams.companyCount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    const isAdmin = user?.role?.toLowerCase() === 'admin';
                    
                    // Admin değilse 10'a sınırla ve uyar
                    if (!isAdmin && value > 10) {
                      setError(`⚠️ ${language === 'tr' ? 'Free pakette maksimum 10 firma aranabilir.' : 'Maximum 10 companies per search in free plan.'} ${language === 'tr' ? 'Daha fazla arama için paket yükseltin!' : 'Upgrade your package to search more!'}`);
                      setTimeout(() => setError(''), 5000);
                      setSearchParams({...searchParams, companyCount: '10'});
                    } else {
                      // Admin ise sınır yok, değeri direkt kaydet
                      setSearchParams({...searchParams, companyCount: value.toString()});
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="action" />
                      </InputAdornment>
                    ),
                    inputProps: { 
                      min: 1, 
                      max: user?.role?.toLowerCase() === 'admin' ? 1000 : 10 
                    }
                  }}
                  helperText={user?.role?.toLowerCase() === 'admin' ? "Admin: No limit" : "Min 1, max 10 companies"}
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

            {/* Loading Mesajı - Modern Animasyon */}
            {isLoading && (
              <Box sx={{ 
                mt: 2, 
                p: 3, 
                bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                borderRadius: '12px',
                textAlign: 'center',
                border: '2px solid #42A5F5',
                boxShadow: '0 4px 20px rgba(21, 101, 192, 0.2)'
              }}>
                {/* Animasyonlu Dönen Dünya */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 3,
                  position: 'relative',
                  height: '120px'
                }}>
                  {/* Merkez Dönen Küre */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    animation: 'spinClockwise 2s linear infinite',
                    zIndex: 10,
                    '@keyframes spinClockwise': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    },
                    filter: 'drop-shadow(0 4px 10px rgba(21, 101, 192, 0.4))'
                  }}>
                    <Typography sx={{ fontSize: '4.5rem' }}>
                      🌍
                    </Typography>
                  </Box>

                  {/* Arka plan pulse efekti */}
                  <Box sx={{
                    position: 'absolute',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    border: '2px solid #42A5F5',
                    opacity: 0.3,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { 
                        transform: 'scale(1)',
                        opacity: 0.3
                      },
                      '50%': { 
                        transform: 'scale(1.1)',
                        opacity: 0.1
                      }
                    }
                  }} />
                </Box>

                {/* Metin */}
                <Typography sx={{ color: '#1565C0', fontWeight: 700, mb: 1, fontSize: '1.1rem' }}>
                  🔍 {t('dashboard.search.searching')}
                </Typography>
                <Typography sx={{ color: '#555', fontSize: '0.9rem', fontWeight: 500 }}>
                  Bu işlem birkaç dakika sürebilir. Lütfen bekleyiniz...
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
                {t('dashboard.search.exportExcel')}
              </ExcelButton>

              {/* Ara Butonu */}
              <ActionButton 
                variant="contained" 
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                disabled={isLoading}
                sx={{ px: { xs: 3, sm: 6 } }}
              >
                {isLoading ? t('dashboard.search.searching') : t('dashboard.search.searchButton')}
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
                label={`1 kredi kullanıldı`}
                sx={{ 
                  bgcolor: '#4caf50', 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              />
            </Box>

            {/* Firma Tablosu - Profesyonel Responsive Data Table */}
            <Box sx={{ 
              overflowX: 'auto',
              borderRadius: { xs: '12px', sm: '16px' },
              border: `1px solid ${BRAND_COLORS.primary}20`,
              mb: 4,
              boxShadow: '0 2px 8px rgba(21, 101, 192, 0.08)',
              WebkitOverflowScrolling: 'touch',
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(21, 101, 192, 0.05)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: BRAND_COLORS.primary,
                borderRadius: '4px',
                '&:hover': {
                  background: BRAND_COLORS.primaryHover,
                }
              }
            }}>
              {/* Sabit Grid Sütun Yapısı - Header ve Satırlar İçin */}
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#FFFFFF',
                borderRadius: { xs: '12px', sm: '16px' },
                overflow: 'hidden',
                minWidth: '1530px',
              }}>
                {/* Tablo Header - Sticky & Fixed */}
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: '200px 250px 180px 160px 130px 130px 110px 110px 180px 180px',
                  gap: 0,
                  bgcolor: `${BRAND_COLORS.primary}15`,
                  borderBottom: `2px solid ${BRAND_COLORS.primary}`,
                  position: 'sticky',
                  top: 0,
                  zIndex: 20,
                  backdropFilter: 'blur(4px)',
                  width: '100%',
                }}>
                  {[
                    'Company Name',
                    'Address',
                    'Website',
                    'Email',
                    'Phone',
                    'Mobile',
                    'City',
                    'Country',
                    'Social Media',
                    'Notes'
                  ].map((label, idx) => (
                    <Box 
                      key={idx}
                      sx={{ 
                        p: '14px 12px',
                        fontWeight: 'bold',
                        color: BRAND_COLORS.primary,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'left',
                        borderRight: idx < 9 ? `1px solid ${BRAND_COLORS.primary}20` : 'none',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        ...(idx === 0 && {
                          position: 'sticky',
                          left: 0,
                          zIndex: 21,
                          bgcolor: `${BRAND_COLORS.primary}15`,
                          boxShadow: '2px 0 4px rgba(21, 101, 192, 0.1)'
                        })
                      }}>
                      {label}
                    </Box>
                  ))}
                </Box>

                {/* Tablo Satırları */}
                {searchResults.businesses.map((business, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'grid',
                      gridTemplateColumns: '200px 250px 180px 160px 130px 130px 110px 110px 180px 180px',
                      gap: 0,
                      borderBottom: `1px solid ${BRAND_COLORS.primary}15`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: `${BRAND_COLORS.primary}08`,
                        boxShadow: `inset 0 0 0 1px ${BRAND_COLORS.primary}20`,
                      },
                      '&:last-child': {
                        borderBottom: 'none',
                        borderRadius: '0 0 16px 16px'
                      }
                    }}
                  >
                    {/* Firma Adı */}
                    <Box sx={{ 
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px',
                      position: 'sticky',
                      left: 0,
                      zIndex: 15,
                      bgcolor: '#FFFFFF',
                      boxShadow: '2px 0 4px rgba(21, 101, 192, 0.08)'
                    }}>
                      <Typography 
                        sx={{ 
                          fontWeight: 600,
                          color: BRAND_COLORS.primary,
                          fontSize: { xs: '0.75rem', sm: '0.85rem' },
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                        title={business.businessName}
                      >
                        {business.businessName}
                      </Typography>
                    </Box>

                    {/* Adres */}
                    <Box sx={{ 
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px'
                    }}>
                      <Typography 
                        sx={{ 
                          color: '#555',
                          fontSize: { xs: '0.75rem', sm: '0.85rem' },
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                        title={business.address}
                      >
                        {business.address || 'Not Found'}
                      </Typography>
                    </Box>

                    {/* Website */}
                    <Box sx={{ 
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px'
                    }}>
                      {business.website ? (
                        <Typography 
                          component="a"
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                          title={business.website}
                        >
                          {business.website}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: '#999', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Not Found</Typography>
                      )}
                    </Box>

                    {/* E-mail */}
                    <Box sx={{ 
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px'
                    }}>
                      {business.email ? (
                        <Typography 
                          component="a"
                          href={`mailto:${business.email}`}
                          sx={{ 
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                          title={business.email}
                        >
                          {business.email}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: '#999', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Not Found</Typography>
                      )}
                    </Box>

                    {/* Telefon */}
                    <Box sx={{ 
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px'
                    }}>
                      {business.phone ? (
                        <Typography 
                          component="a"
                          href={`tel:${business.phone}`}
                          sx={{ 
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                          }}
                          title={business.phone}
                        >
                          {business.phone}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: '#999', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Not Found</Typography>
                      )}
                    </Box>

                    {/* Mobil */}
                    <Box sx={{ 
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px'
                    }}>
                      {business.mobile ? (
                        <Typography 
                          component="a"
                          href={`tel:${business.mobile}`}
                          sx={{ 
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                          }}
                          title={business.mobile}
                        >
                          {business.mobile}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: '#999', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Not Found</Typography>
                      )}
                    </Box>

                    {/* Şehir */}
                    <Box sx={{ 
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px'
                    }}>
                      <Typography sx={{ color: '#555', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                        {business.city || 'Not Found'}
                      </Typography>
                    </Box>

                    {/* Ülke */}
                    <Box sx={{ 
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px'
                    }}>
                      <Typography sx={{ color: '#555', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                        {business.country || 'Not Found'}
                      </Typography>
                    </Box>

                    {/* Sosyal Medya */}
                    <Box sx={{ 
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      borderRight: `1px solid ${BRAND_COLORS.primary}15`,
                      minHeight: '50px'
                    }}>
                      {business.socialMedia ? (
                        <Typography 
                          component="a"
                          href={business.socialMedia}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                          title={business.socialMedia}
                        >
                          {business.socialMedia}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: '#999', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>Not Found</Typography>
                      )}
                    </Box>

                    {/* Notlar/Yorum */}
                    <Box sx={{ 
                      p: { xs: '10px 12px', sm: '12px 14px' },
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: '50px'
                    }}>
                      <Typography 
                        sx={{ 
                          color: '#555',
                          fontSize: { xs: '0.75rem', sm: '0.85rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                        title={business.comments || 'Not Found'}
                      >
                        {business.comments || 'Not Found'}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Bilgi Mesajı */}
            <Box sx={{ 
              bgcolor: 'rgba(21, 101, 192, 0.05)',
              border: `1px solid ${BRAND_COLORS.primary}30`,
              borderRadius: '12px',
              p: { xs: 2, sm: 2.5 },
              textAlign: 'center',
              mb: 3
            }}>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                📊 Toplam <strong>{searchResults.businesses.length}</strong> firma listelendi. Tüm verileri Excel'e aktarmak için aşağıdaki butonu kullanın.
              </Typography>
            </Box>

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
              <Typography variant="body2" sx={{ color: '#666', mt: 2, fontSize: '0.85rem', fontStyle: 'italic' }}>
                💡 Tüm firma bilgilerini detaylı şekilde Excel formatında indirebilirsiniz.
              </Typography>
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