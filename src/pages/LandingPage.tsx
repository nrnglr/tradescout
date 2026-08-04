import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import paratikaLogo from '../assent/paratika-sanal-pos-beyaz-logo.png';
import { keyframes } from '@mui/system';
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Chip,
  IconButton,
  Drawer,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Badge
} from '@mui/material';

import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import GroupsIcon from '@mui/icons-material/Groups';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedIcon from '@mui/icons-material/Verified';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DescriptionIcon from '@mui/icons-material/Description';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LanguageIcon from '@mui/icons-material/Language';
// Logo import - FGSTrade
import logoImage from '../assent/fgs-logo.png';
// Iyzico ödeme logoları (beyaz versiyonlar)
import payWithIyzicoWhite from '../assent/pay_with_iyzico_white.png';

import { useLanguage } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';

// --- STİL TANIMLAMALARI ---
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.7); }
  50% { transform: scale(1.03); box-shadow: 0 0 0 15px rgba(211, 47, 47, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(211, 47, 47, 0); }
`;

const blinkText = keyframes`
  0%, 100% { opacity: 1; color: #FFFFFF; }
  50% { opacity: 0.85; color: #FFEB3B; }
`;

const PageContainer = styled(Box)({
  minHeight: '100vh',
  width: '100%',
  background: 'linear-gradient(180deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)',
  overflowX: 'hidden',
});

// Üst Menü (Navbar)
const StyledAppBar = styled(AppBar)({
  background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.98) 0%, rgba(227, 242, 253, 0.95) 30%, rgba(21, 101, 192, 0.95) 50%, rgba(21, 101, 192, 0.95) 100%)',
  boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
  backdropFilter: 'blur(10px)',
});

const LogoImage = styled('img')(({ theme }) => ({
  height: '105px',
  width: 'auto',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  objectFit: 'contain',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  [theme.breakpoints.down('lg')]: {
    height: '102px',
  },
  [theme.breakpoints.down('md')]: {
    height: '95px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '88px',
  },
  [theme.breakpoints.down(450)]: {
    height: '85px',
  },
  [theme.breakpoints.down(380)]: {
    height: '82px',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: '#1565C0',
  fontSize: '2.72rem',
  cursor: 'pointer',
  marginLeft: '6px',
  whiteSpace: 'nowrap',
  textShadow: '0 0 20px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.9), 0 2px 10px rgba(255, 255, 255, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.15)',
  [theme.breakpoints.down('lg')]: {
    fontSize: '2.4rem',
    marginLeft: '5px',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '2.16rem',
    marginLeft: '13px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.92rem',
    marginLeft: '9px',
  },
  [theme.breakpoints.down(450)]: {
    fontSize: '1.76rem',
    marginLeft: '2px',
  },
  [theme.breakpoints.down(380)]: {
    fontSize: '1.6rem',
    marginLeft: '2px',
  },
}));

const NavButton = styled(Button)({
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1.15rem',
  color: '#FFFFFF',
  marginLeft: '1.2rem',
  padding: '10px 18px',
  '&:hover': {
    color: '#E3F2FD',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});

const LoginButton = styled(Button)({
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1.15rem',
  borderRadius: '12px',
  padding: '10px 30px',
  background: '#1565C0',
  color: '#FFFFFF',
  marginLeft: '2rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  '&:hover': {
    background: '#0D47A1',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
  },
  transition: 'all 0.3s ease',
});

// Hero Bölümü
const HeroSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(16, 0, 10),
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  minHeight: '90vh',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(12, 0, 8),
    minHeight: '80vh',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(14, 0, 6),
    minHeight: '70vh',
    paddingTop: '140px',
  },
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  color: '#FFFFFF',
  marginBottom: theme.spacing(3),
  lineHeight: 1.2,
  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
}));

// Kartlar
const FeatureCard = styled(Card)({
  height: '100%',
  borderRadius: '20px',
  border: 'none',
  background: 'rgba(255, 255, 255, 0.95)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
  },
});

const IconWrapper = styled(Box)({
  width: 60,
  height: 60,
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
  color: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  boxShadow: '0 4px 12px rgba(21, 101, 192, 0.3)',
});

// Footer
const Footer = styled(Box)({
  background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
  color: 'white',
  padding: '60px 0 20px',
  boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
});

// Feedback Form Card
const FeedbackCard = styled(Card)({
  borderRadius: '20px',
  border: 'none',
  background: 'rgba(255, 255, 255, 0.95)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
    transform: 'translateY(-4px)',
  },
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 14,
    backgroundColor: '#F8F9FA',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: '#E0E0E0',
      borderWidth: 2,
    },
    '&:hover fieldset': {
      borderColor: '#1565C0',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1565C0',
      borderWidth: 2,
    },
    '&.Mui-focused': {
      backgroundColor: '#FFFFFF',
      boxShadow: '0 4px 12px rgba(21, 101, 192, 0.1)',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#1565C0',
    fontWeight: 600,
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 14,
    backgroundColor: '#F8F9FA',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: '#E0E0E0',
      borderWidth: 2,
    },
    '&:hover fieldset': {
      borderColor: '#1565C0',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1565C0',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#1565C0',
    fontWeight: 600,
  },
}));

const SubmitButton = styled(Button)({
  borderRadius: 14,
  fontWeight: 700,
  fontSize: 16,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
  color: '#FFFFFF',
  boxShadow: '0 6px 20px rgba(21, 101, 192, 0.3)',
  transition: 'all 0.3s ease',
  padding: '12px 32px',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 28px rgba(21, 101, 192, 0.4)',
    background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
  },
  '&:active': {
    transform: 'translateY(-1px)',
  },
});

// --- TRADEpal BANNER STİLLERİ ---
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
`;

const TradepalBanner = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  background: 'radial-gradient(1200px circle at 85% 20%, rgba(0, 230, 195, 0.10), transparent 55%), linear-gradient(150deg, #050B18 0%, #0A1428 45%, #0D1B2A 100%)',
  color: '#FFFFFF',
  padding: theme.spacing(6, 0),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(5, 0),
  },
}));

const TradepalTopBar = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '12px',
  marginBottom: '28px',
});

const TradepalLogoText = styled(Typography)({
  fontWeight: 900,
  fontSize: '1.6rem',
  letterSpacing: '0.5px',
  background: 'linear-gradient(90deg, #00E6C3 0%, #29B6F6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

const TradepalPartnerChip = styled(Box)({
  padding: '5px 14px',
  borderRadius: '999px',
  border: '1px solid rgba(0, 230, 195, 0.35)',
  background: 'rgba(0, 230, 195, 0.08)',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#B9F5EA',
  whiteSpace: 'nowrap',
});

const TradepalHighlight = styled('span')({
  background: 'linear-gradient(90deg, #00E6C3 0%, #00FFA3 50%, #29B6F6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textShadow: '0 0 30px rgba(0, 230, 195, 0.35)',
});

const TradepalFeatureRow = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '14px',
});

const TradepalFeatureIcon = styled(Box)({
  width: 44,
  height: 44,
  minWidth: 44,
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, rgba(0, 230, 195, 0.18) 0%, rgba(41, 182, 246, 0.18) 100%)',
  border: '1px solid rgba(0, 230, 195, 0.3)',
  color: '#00E6C3',
});

const TradepalCTAButton = styled('a')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  padding: '14px 30px',
  borderRadius: '14px',
  fontWeight: 700,
  fontSize: '1.05rem',
  textDecoration: 'none',
  color: '#04121A',
  background: 'linear-gradient(90deg, #00E6C3 0%, #29B6F6 100%)',
  boxShadow: '0 8px 28px rgba(0, 230, 195, 0.35)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 34px rgba(0, 230, 195, 0.5)',
  },
});

const TradepalLinkText = styled('a')({
  color: '#7FE9DA',
  fontWeight: 600,
  textDecoration: 'none',
  fontSize: '1rem',
  borderBottom: '1px solid rgba(127, 233, 218, 0.4)',
  paddingBottom: '2px',
  transition: 'all 0.25s ease',
  cursor: 'pointer',
  '&:hover': {
    color: '#00E6C3',
    borderColor: '#00E6C3',
  },
});

const TradepalVisualPlaceholder = styled('a')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  minHeight: 320,
  borderRadius: '24px',
  background: 'linear-gradient(160deg, rgba(41, 182, 246, 0.12) 0%, rgba(0, 230, 195, 0.08) 100%)',
  border: '1px solid rgba(255,255,255,0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  textDecoration: 'none',
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {
    minHeight: 240,
  },
}));

const TradepalFloatingCard = styled(Box)({
  position: 'absolute',
  padding: '14px 18px',
  borderRadius: '16px',
  background: 'rgba(10, 20, 40, 0.75)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(0, 230, 195, 0.3)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
  animation: `${float} 4s ease-in-out infinite`,
  maxWidth: 240,
});

const TradepalFooterStrip = styled(Box)(({ theme }) => ({
  marginTop: '48px',
  paddingTop: '28px',
  borderTop: '1px solid rgba(255,255,255,0.1)',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '20px',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
}));

const TradepalFooterItem = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
});

// --- COMPONENT ---

const LandingPage = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { addToCart, openCart, itemCount } = useCart();
  const location = useLocation(); //
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlLang = searchParams.get('lang');

    if (urlLang === 'en' || urlLang === 'tr') {
      setLanguage(urlLang);
    }
  }, [location.search, setLanguage]);
  // Paket bilgileri
  // ⚠️ TEST FİYATLARI: starter aylık=1TL, yıllık=2TL (backend PriceTry ile belirlenir)
  // Canlıya geçince: price: 15, yearlyPrice: 99 yap
  const packages = {
    starter: {
      id: 'starter',
      name: t('packages.starter.name'),
      price: 10,       // gösterim USD — gerçek çekim backend PriceTry=100 (1TL)
      yearlyPrice: 69, // gösterim USD — gerçek çekim backend PriceTry=200 (2TL)
      searchLimit: t('packages.starter.searchLimit'),
      features: [
        t('packages.starter.feature1'),
        t('packages.starter.feature2'),
        t('packages.starter.feature3'),
        t('packages.starter.feature4'),
        t('packages.starter.feature5'),
        t('packages.starter.feature6'),
        t('packages.starter.feature7'),
        t('packages.starter.feature8'),
      ]
    },
    professional: {
      id: 'pro_monthly',
      name: t('packages.professional.name'),
      price: 26,
      yearlyPrice: 199,
      searchLimit: t('packages.professional.searchLimit'),
      features: [
        t('packages.professional.feature1'),
        t('packages.professional.feature2'),
        t('packages.professional.feature3'),
        t('packages.professional.feature4'),
        t('packages.professional.feature5'),
      ]
    },
    enterprise: {
      id: 'business_monthly',
      name: t('packages.enterprise.name'),
      price: 53,
      yearlyPrice: 399,
      searchLimit: t('packages.enterprise.searchLimit'),
      features: [
        t('packages.enterprise.feature1'),
        t('packages.enterprise.feature2'),
        t('packages.enterprise.feature3'),
        t('packages.enterprise.feature4'),
        t('packages.enterprise.feature5'),
      ]
    }
  };

  const handleAddToCart = (packageType: 'starter' | 'professional' | 'enterprise') => {
    const pkg = packages[packageType];
    addToCart({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      yearlyPrice: pkg.yearlyPrice,
      period: 'monthly',
      searchLimit: pkg.searchLimit,
      features: pkg.features
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  const handleLanguageChange = (event: React.MouseEvent<HTMLElement>, newLanguage: 'tr' | 'en' | null) => {
    if (newLanguage !== null) {
      setLanguage(newLanguage);
      
     
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('lang', newLanguage);
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError('');

    // Validasyon kuralları
    if (!fullName || fullName.trim().length === 0) {
      setFeedbackError('Ad Soyad zorunludur');
      return;
    }

    if (fullName.length > 100) {
      setFeedbackError('Ad Soyad maksimum 100 karakter olmalıdır');
      return;
    }

    if (!email || email.trim().length === 0) {
      setFeedbackError('Email adresi zorunludur');
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setFeedbackError('Geçerli bir email adresi giriniz');
      return;
    }

    if (phone && phone.length > 20) {
      setFeedbackError('Geçerli bir telefon numarası giriniz');
      return;
    }

    if (!subject || subject.trim().length === 0) {
      setFeedbackError('Başlık zorunludur');
      return;
    }

    if (subject.length > 255) {
      setFeedbackError('Başlık maksimum 255 karakter olmalıdır');
      return;
    }

    if (!message || message.trim().length === 0) {
      setFeedbackError('Mesaj zorunludur');
      return;
    }

    if (message.length < 10) {
      setFeedbackError('Mesaj en az 10 karakter olmalıdır');
      return;
    }

    if (message.length > 2000) {
      setFeedbackError('Mesaj maksimum 2000 karakter olmalıdır');
      return;
    }

    setFeedbackLoading(true);

    try {
      // Backend PascalCase bekliyor
      const requestData = {
        FullName: fullName,
        Email: email,
        Phone: phone || null,
        Subject: subject,
        Message: message,
        FeedbackType: feedbackType || null,
      };

      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setFeedbackSuccess(true);
        setFeedbackType('');
        setFullName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
        setTimeout(() => setFeedbackSuccess(false), 5000);
      } else {
        // Sunucu hatasını logla (geliştirici için) ve kullanıcıya genel mesaj göster
        const errText = await response.text().catch(() => '');
        console.error('Feedback API hatası:', response.status, errText);
        if (response.status === 429) {
          setFeedbackError('Çok fazla istek gönderildi. Lütfen birkaç dakika bekleyip tekrar deneyin.');
        } else {
          setFeedbackError('Form gönderilemedi. Lütfen bilgilerinizi kontrol edip tekrar deneyin.');
        }
      }
    } catch (error) {
      // Ağ hatası — sunucuya ulaşılamadı
      console.error('Feedback gönderme hatası:', error);
      setFeedbackError('Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <PageContainer>
      {/* --- NAVBAR --- */}
      <StyledAppBar position="fixed" color="default">
        <Container maxWidth={false} sx={{ px: { xs: 0, sm: 1, md: 3, lg: 5, xl: 8 } }}>
          <Toolbar
            disableGutters
            sx={{
              py: { xs: 0.5, md: 0.8 },
              minHeight: { xs: '85px', md: '110px' },
              maxHeight: { xs: '85px', md: '110px' },
              overflow: 'hidden'
            }}
          >
            {/* Logo */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', height: '100%', pl: { xs: 0, sm: 0.5 } }}>
              <LogoImage
                src={logoImage}
                alt="Trade Scout Logo"
                onClick={() => window.scrollTo(0, 0)}
              />
              <LogoText onClick={() => window.scrollTo(0, 0)}>
                FGS TRADE
              </LogoText>
            </Box>

            {/* Menü Linkleri (Masaüstü) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', gap: { md: 0.5, lg: 1 } }}>
              <NavButton
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('navbar.features')}
              </NavButton>
              <NavButton
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('navbar.about')}
              </NavButton>
              <NavButton
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('navbar.contact')}
              </NavButton>
              <NavButton
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('navbar.packages')}
              </NavButton>

              {/* Dil Seçici */}
              <ToggleButtonGroup
                value={language}
                exclusive
                onChange={handleLanguageChange}
                aria-label="language"
                size="small"
                sx={{
                  ml: 1,
                  '& .MuiToggleButton-root': {
                    color: '#FFFFFF',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                }}
              >
                <ToggleButton value="tr" aria-label="Turkish">
                  TR
                </ToggleButton>
                <ToggleButton value="en" aria-label="English">
                  EN
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Sepet Butonu (Desktop) */}
            <IconButton
              onClick={openCart}
              sx={{
                display: { xs: 'none', md: 'flex' },
                color: '#FFFFFF',
                ml: 1,
              }}
            >
              <Badge badgeContent={itemCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* Giriş Yap Butonu (Desktop) */}
            <LoginButton
              onClick={() => navigate('/login')}
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                ml: { md: 1 }
              }}
            >
              {t('navbar.login')}
            </LoginButton>

            {/* Hamburger Menü İkonu (Mobil & Tablet) */}
            <IconButton
              onClick={toggleMobileMenu}
              sx={{
                display: { xs: 'flex', md: 'none' },
                color: '#FFFFFF',
                ml: 1,
                p: 0.5,
              }}
            >
              <MenuIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* --- MOBİL MENÜ DRAWER --- */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '75%', sm: '350px' },
            background: 'linear-gradient(180deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)',
            color: '#FFFFFF',
            padding: 3,
          },
        }}
      >
        {/* Drawer Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#FFFFFF' }}>
            {t('navbar.home')}
          </Typography>
          <IconButton onClick={toggleMobileMenu} sx={{ color: '#FFFFFF' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mb: 3 }} />

        {/* Menü İçeriği */}
        <List sx={{ flexGrow: 1 }}>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleMenuItemClick(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }))}
              sx={{
                borderRadius: 2,
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 40 }}>
                <SavedSearchIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('navbar.features')}
                primaryTypographyProps={{ fontWeight: 600, fontSize: '1.1rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleMenuItemClick(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }))}
              sx={{
                borderRadius: 2,
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 40 }}>
                <VerifiedIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('navbar.about')}
                primaryTypographyProps={{ fontWeight: 600, fontSize: '1.1rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleMenuItemClick(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }))}
              sx={{
                borderRadius: 2,
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 40 }}>
                <LocationOnIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('navbar.contact')}
                primaryTypographyProps={{ fontWeight: 600, fontSize: '1.1rem' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleMenuItemClick(() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }))}
              sx={{
                borderRadius: 2,
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 40 }}>
                <StarIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('navbar.packages')}
                primaryTypographyProps={{ fontWeight: 600, fontSize: '1.1rem' }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', my: 2 }} />

        {/* Dil Seçici (Mobil) */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#E3F2FD', mb: 1, fontWeight: 600 }}>
            Dil Seçin / Select Language
          </Typography>
          <ToggleButtonGroup
            value={language}
            exclusive
            onChange={handleLanguageChange}
            aria-label="language"
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                py: 1,
                fontWeight: 600,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.35)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                },
              },
            }}
          >
            <ToggleButton value="tr" aria-label="Turkish">
              TR
            </ToggleButton>
            <ToggleButton value="en" aria-label="English">
              EN
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', my: 2 }} />

        {/* Alt Butonlar */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Sepet Butonu (Mobil) */}
          <Button
            variant="outlined"
            fullWidth
            startIcon={
              <Badge badgeContent={itemCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            }
            onClick={() => { openCart(); setMobileMenuOpen(false); }}
            sx={{
              borderColor: '#FFFFFF',
              color: '#FFFFFF',
              borderRadius: '12px',
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#E3F2FD',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            {language === 'tr' ? 'Sepetim' : 'My Cart'}
          </Button>

          <Button
            variant="contained"
            fullWidth
            startIcon={<LoginIcon />}
            onClick={() => handleMenuItemClick(() => navigate('/login'))}
            sx={{
              bgcolor: '#FFFFFF',
              color: '#1565C0',
              borderRadius: '12px',
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              '&:hover': {
                bgcolor: '#E3F2FD',
                transform: 'translateY(-2px)',
              },
            }}
          >
            {t('navbar.login')}
          </Button>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<PersonAddIcon />}
            onClick={() => handleMenuItemClick(() => navigate('/register'))}
            sx={{
              borderColor: '#FFFFFF',
              borderWidth: 2,
              color: '#FFFFFF',
              borderRadius: '12px',
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': {
                borderWidth: 2,
                borderColor: '#E3F2FD',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {t('login.register')}
          </Button>
        </Box>
      </Drawer>

     

      {/* --- HERO SECTION --- */}
      <HeroSection>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 8, lg: 10, xl: 12 } }}>
          <Box sx={{ display: 'flex', gap: { xs: 3, md: 8 }, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: '280px', maxWidth: { md: '600px' } }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#E3F2FD',
                  fontWeight: 'bold',
                  mb: 2,
                  mt: { xs: 2, sm: 0 },
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                }}
              >
                {t('hero.subtitle')}
              </Typography>
              <HeroTitle variant="h2" sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' } }}>
                {t('hero.title')} <br />
                <span style={{ color: '#E3F2FD' }}>{t('hero.titleHighlight')}</span>
              </HeroTitle>
              <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 4, lineHeight: 1.8, fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem', lg: '1.25rem' } }}>
                {t('hero.description')}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    bgcolor: '#FFFFFF',
                    color: '#1565C0',
                    borderRadius: '12px',
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.2, sm: 1.5 },
                    textTransform: 'none',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    '&:hover': {
                      bgcolor: '#E3F2FD',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  {t('hero.startNow')}
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: '#FFFFFF',
                    color: '#1565C0',
                    borderRadius: '12px',
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.2, sm: 1.5 },
                    textTransform: 'none',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    '&:hover': {
                      bgcolor: '#E3F2FD',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  {t('hero.demoSignup')}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  sx={{
                    borderColor: '#FFFFFF',
                    borderWidth: 2,
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.2, sm: 1.5 },
                    textTransform: 'none',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: '#E3F2FD',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {t('hero.moreInfo')}
                </Button>
              </Stack>
            </Box>
            <Box sx={{ flex: 1, minWidth: '280px', position: 'relative', display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '24px',
                  padding: { xs: 3, sm: 4, md: 6 },
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {/* Arka plan deseni */}
                <Box sx={{ position: 'absolute', top: 0, right: 0, opacity: 0.1 }}>
                  <TrendingUpIcon sx={{ fontSize: 200, color: 'white' }} />
                </Box>

                {/* İçerik */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 4 }}>
                    <Box sx={{ textAlign: 'center', color: 'white' }}>
                      <AnalyticsIcon sx={{ fontSize: 60, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">1000+</Typography>
                      <Typography variant="body2">{t('hero.statsCompanies')}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', color: 'white' }}>
                      <GroupsIcon sx={{ fontSize: 60, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">500+</Typography>
                      <Typography variant="body2">{t('hero.statsCustomers')}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', color: 'white' }}>
                      <SpeedIcon sx={{ fontSize: 60, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">%95</Typography>
                      <Typography variant="body2">{t('hero.statsSuccess')}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    p: 3,
                    backdropFilter: 'blur(10px)',
                  }}>
                    <Typography variant="h6" color="white" fontWeight="bold" gutterBottom>
                      <RocketLaunchIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {t('hero.fastReliable')}
                    </Typography>
                    <Typography variant="body1" color="rgba(255,255,255,0.9)">
                      {t('hero.fastReliableDesc')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </HeroSection>
       {/* --- TRADEpal BANNER --- */}
      <TradepalBanner
      sx={{
          borderRadius: { xs: '24px', md: '40px' }, // 1. Köşeleri şık bir şekilde yuvarlar
          overflow: 'hidden',                       // 2. İçerdeki renklerin köşelerden taşmasını engeller
          mx: { xs: 2, sm: 4, md: 8, lg: 10 },      // 3. Sağdan ve soldan boşluk bırakır (Kıvrımın belli olması için en önemli ayar budur)
          my: { xs: 4, md: 6 },                     // 4. Üstten ve alttan boşluk bırakır
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)', // 5. (Ekstra) Afişin sayfada havada durduğu hissini vermek için derinlik gölgesi
        }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 8, lg: 10, xl: 12 } }}>
          {/* Üst Başlıklar */}
          <TradepalTopBar>
            <TradepalLogoText>TRADEpal</TradepalLogoText>
            <TradepalPartnerChip>FGS Trade iş birliğiyle sunulmaktadır.</TradepalPartnerChip>
          </TradepalTopBar>

          <Box sx={{ display: 'flex', gap: { xs: 4, md: 8 }, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* SOL TARAF */}
            <Box sx={{ flex: 1, minWidth: '280px' }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2rem', sm: '2.6rem', md: '3.1rem' },
                  lineHeight: 1.15,
                  mb: 2,
                  color: '#FFFFFF',
                }}
              >
                Dünya Ticaret <TradepalHighlight>Verilerine Ulaşın!</TradepalHighlight>
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.7,
                  mb: 4,
                  maxWidth: '560px',
                }}
              >
                Gümrük ve konşimento verileriyle gerçek ithalatçıları, ihracatçıları, alıcıları ve tedarikçileri keşfedin. Ticaret hareketlerini analiz ederek yeni iş fırsatları yakalayın.
              </Typography>

              {/* Orta Kısımdaki İkonlu Özellikler */}
              <Stack spacing={2.5} sx={{ mb: 4 }}>
                <TradepalFeatureRow>
                  <TradepalFeatureIcon>
                    <VerifiedIcon />
                  </TradepalFeatureIcon>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1rem' }}>
                      Gümrük Verileri
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.92rem' }}>
                      Doğru, güncel ve kapsamlı
                    </Typography>
                  </Box>
                </TradepalFeatureRow>

                <TradepalFeatureRow>
                  <TradepalFeatureIcon>
                    <DescriptionIcon />
                  </TradepalFeatureIcon>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1rem' }}>
                      Konşimento Verileri
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.92rem' }}>
                      Gerçek sevkiyat bilgilerine erişim
                    </Typography>
                  </Box>
                </TradepalFeatureRow>

                <TradepalFeatureRow>
                  <TradepalFeatureIcon>
                    <AnalyticsIcon />
                  </TradepalFeatureIcon>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1rem' }}>
                      Pazar Analizi
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.92rem' }}>
                      Rakiplerinizi analiz edin, fırsatları yakalayın
                    </Typography>
                  </Box>
                </TradepalFeatureRow>
              </Stack>

              {/* Aksiyon Butonu */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
               <TradepalCTAButton href="https://www.etradepal.com" target="_blank" rel="noopener noreferrer">
                  Etradepal'i Keşfet <ArrowForwardIcon fontSize="small" />
                </TradepalCTAButton>
                <TradepalLinkText href="https://www.etradepal.com" target="_blank" rel="noopener noreferrer">
    etradepal.com
                  
                </TradepalLinkText>
              </Box>
            </Box>

            {/* SAĞ TARAF - Dekoratif Görsel Alanı */}
            <Box sx={{ flex: 1, minWidth: '280px', maxWidth: { md: '520px' } }}>
              <TradepalVisualPlaceholder
                href="http://www.etradepal.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* Gemi / Dünya görseli yer tutucu */}
                <DirectionsBoatIcon sx={{ fontSize: { xs: 90, md: 130 }, color: 'rgba(0, 230, 195, 0.35)' }} />
                <LanguageIcon
                  sx={{
                    position: 'absolute',
                    fontSize: { xs: 140, md: 200 },
                    color: 'rgba(41, 182, 246, 0.12)',
                  }}
                />

                {/* Yüzen Kutular */}
                <TradepalFloatingCard sx={{ top: { xs: 16, md: 28 }, left: { xs: 16, md: 24 }, animationDelay: '0s' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <VerifiedIcon sx={{ fontSize: 18, color: '#00E6C3' }} />
                    <Typography sx={{ fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.5px', color: '#00E6C3' }}>
                      GÜMRÜK VERİLERİ
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>
                    Doğru, güncel ve kapsamlı bilgiler
                  </Typography>
                </TradepalFloatingCard>

                <TradepalFloatingCard sx={{ bottom: { xs: 16, md: 28 }, right: { xs: 16, md: 24 }, animationDelay: '1.5s' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <DescriptionIcon sx={{ fontSize: 18, color: '#29B6F6' }} />
                    <Typography sx={{ fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.5px', color: '#29B6F6' }}>
                      KONŞİMENTO VERİLERİ
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>
                    Gerçek sevkiyat bilgilerine erişim
                  </Typography>
                </TradepalFloatingCard>
              </TradepalVisualPlaceholder>
            </Box>
          </Box>

          {/* En Alt Bilgi Çubuğu */}
          <TradepalFooterStrip>
            <TradepalFooterItem>
              <VerifiedIcon sx={{ color: '#00E6C3', fontSize: 26 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF' }}>
                  Güvenilir Kaynak
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
                  Doğru ve güvenilir verilerle işinizi büyütün.
                </Typography>
              </Box>
            </TradepalFooterItem>

            <TradepalFooterItem>
              <PublicIcon sx={{ color: '#00E6C3', fontSize: 26 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF' }}>
                  Dünya Çapında Kapsam
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
                  200+ ülke, milyonlarca kayıt ve geniş kapsam.
                </Typography>
              </Box>
            </TradepalFooterItem>

            <TradepalFooterItem>
              <TrendingUpIcon sx={{ color: '#00E6C3', fontSize: 26 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF' }}>
                  Güncel ve Doğru Veri
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
                  Sürekli güncellenen verilerle her zaman bir adım önde olun.
                </Typography>
              </Box>
            </TradepalFooterItem>

            <TradepalFooterItem>
              <EmailIcon sx={{ color: '#00E6C3', fontSize: 26 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF' }}>
                  İletişim
                </Typography>
                {/* Bot Korumalı E-posta Alanı Başlangıcı */}
                <Typography 
                  component="span"
                  onClick={(e) => {
                    e.preventDefault();
                    const user = "info";
                    const domain = "fgstrade.com";
                    window.location.href = `mail\u0074o:${user}@${domain}`;
                  }}
                  sx={{ 
                    fontSize: '0.82rem', 
                    color: 'rgba(255,255,255,0.6)', 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  info<span>@</span>fgstrade.com
                </Typography>
                {/* Bot Korumalı E-posta Alanı Bitişi */}
              </Box>
            </TradepalFooterItem>
          </TradepalFooterStrip>
        </Container>
      </TradepalBanner>

      {/* --- ÖZELLİKLER --- */}
      <Box id="features" sx={{ py: 12, bgcolor: 'transparent', position: 'relative' }}>
        {/* Dekoratif ikonlar */}
        <Box sx={{ position: 'absolute', top: 50, left: 50, opacity: 0.05 }}>
          <TrendingUpIcon sx={{ fontSize: 150, color: 'white' }} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: 50, right: 50, opacity: 0.05 }}>
          <BusinessIcon sx={{ fontSize: 150, color: 'white' }} />
        </Box>

     
          <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8, lg: 10, xl: 12 }, position: 'relative', zIndex: 1 }}>
          <Box textAlign="center" mb={4}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <StarIcon sx={{ color: '#FFFFFF' }} />
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>{t('packages.pricing')}</Typography>
            </Box>
            <Typography variant="h3" fontWeight="800" mt={1} sx={{ color: '#FFFFFF' }}>{t('packages.choosePackage')}</Typography>
            <Typography variant="body1" sx={{ color: '#E3F2FD', maxWidth: '600px', mx: 'auto' }} mt={2}>
              {t('packages.flexiblePackages')}
            </Typography>
          </Box>

          
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Kart 1 */}
            <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <FeatureCard>
                <CardContent sx={{ p: 4 }}>
                  <IconWrapper><PublicIcon fontSize="large" /></IconWrapper>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>{t('features.feature1.title')}</Typography>
                  <Typography color="text.secondary">
                    {t('features.feature1.description')}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Box>
            {/* Kart 2 */}
            <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <FeatureCard>
                <CardContent sx={{ p: 4 }}>
                  <IconWrapper><SavedSearchIcon fontSize="large" /></IconWrapper>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>{t('features.feature2.title')}</Typography>
                  <Typography color="text.secondary">
                    {t('features.feature2.description')}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Box>
            {/* Kart 3 */}
            <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <FeatureCard>
                <CardContent sx={{ p: 4 }}>
                  <IconWrapper><BusinessIcon fontSize="large" /></IconWrapper>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>{t('features.feature3.title')}</Typography>
                  <Typography color="text.secondary">
                    {t('features.feature3.description')}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Box>
          </Box>
        </Container>
      </Box>
      
      

      {/* --- FİYATLANDIRMA VE PAKETLER --- */}
     {/* --- FİYATLANDIRMA VE PAKETLER --- */}
      <Box id="packages" sx={{ py: 12, bgcolor: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
        
        {/* Açık Mavi Gölge Arka Planı */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(100, 150, 220, 0.15) 0%, rgba(100, 150, 220, 0.08) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Bulanık Logo Arka Planı */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.08,
          filter: 'blur(20px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}>
          <img
            src={logoImage}
            alt="Background Logo"
            style={{
              width: '400px',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* Dekoratif ikonlar */}
        <Box sx={{ position: 'absolute', top: 50, left: 50, opacity: 0.05 }}>
          <StarIcon sx={{ fontSize: 150, color: 'white' }} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: 50, right: 50, opacity: 0.05 }}>
          <RocketLaunchIcon sx={{ fontSize: 150, color: 'white' }} />
        </Box>

        <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8, lg: 10, xl: 12 }, position: 'relative', zIndex: 1 }}>
          <Box textAlign="center" mb={4}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <StarIcon sx={{ color: '#FFFFFF' }} />
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>{t('packages.pricing')}</Typography>
            </Box>
            <Typography variant="h3" fontWeight="800" mt={1} sx={{ color: '#FFFFFF' }}>{t('packages.choosePackage')}</Typography>
            <Typography variant="body1" sx={{ color: '#E3F2FD', maxWidth: '600px', mx: 'auto' }} mt={2}>
              {t('packages.flexiblePackages')}
            </Typography>
          </Box>

         
          

          <Box sx={{
            display: 'flex',
            gap: { xs: 3, sm: 4 },
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'stretch',
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            {/* Başlangıç Paketi */}
            <Box sx={{ flex: '1 1 100%', minWidth: { sm: '320px', md: '350px' }, maxWidth: { xs: '100%', sm: '400px' }, display: 'flex' }}>
              <FeatureCard sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardContent sx={{ p: { xs: 3, sm: 4 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#1565C0', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                    {t('packages.starter.name')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {t('packages.starter.subtitle')}
                  </Typography>
                  
                  {/* BAŞLANGIÇ PAKETİ İNDİRİMLİ FİYAT ALANI */}
                  <Box sx={{ my: { xs: 2, sm: 3 } }}>
                    <Typography variant="h5" sx={{ color: 'text.disabled', textDecoration: 'line-through', mb: -1, fontWeight: 'bold' }}>
                      {t('packages.starter.price')}
                    </Typography>
                    <Typography variant="h3" fontWeight="900" sx={{ color: '#D32F2F', display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' } }}>
                      {packages.starter.price} USD 
                      <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 1, fontWeight: 'medium' }}>
                         {t('packages.starter.period')}
                      </Typography>
                    </Typography>
                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                        {t('packages.starter.yearlyNote')}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: '#D32F2F' }}>
                        {packages.starter.yearlyPrice} USD 
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: '#1565C0', mt: 0.5 }}>
                        {t('packages.starter.yearlyCreditsNote')}
                      </Typography>
                    </Box>
                  </Box>

                  <List sx={{ flexGrow: 1 }}>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.starter.searchLimit')} primaryTypographyProps={{ fontWeight: 'bold' }} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.starter.feature1')} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.starter.feature2')} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.starter.feature3')} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.starter.feature4')} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.starter.feature5')} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.starter.feature6')} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.starter.feature7')} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.starter.feature8')} />
                    </ListItem>
                  </List>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => handleAddToCart('starter')}
                    sx={{
                      mt: 3,
                      borderColor: '#1565C0',
                      color: '#1565C0',
                      borderWidth: 2,
                      borderRadius: '12px',
                      py: 1.5,
                      fontWeight: 'bold',
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: '#0D47A1',
                        bgcolor: 'rgba(21, 101, 192, 0.05)',
                      },
                    }}
                  >
                    {t('packages.addToCart')}
                  </Button>
                </CardContent>
              </FeatureCard>
            </Box>

            {/* Profesyonel Paket (Öne Çıkan) */}
            <Box sx={{ flex: '1 1 100%', minWidth: { sm: '320px', md: '350px' }, maxWidth: { xs: '100%', sm: '400px' }, display: 'flex' }}>
              <FeatureCard
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '3px solid #1565C0',
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                <Chip
                  label={t('packages.mostPopular')}
                  sx={{
                    position: 'absolute',
                    top: -15,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#1565C0',
                    color: 'white',
                    fontWeight: 'bold',
                    px: 2,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                />
                <CardContent sx={{ p: { xs: 3, sm: 4 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#1565C0', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                    {t('packages.professional.name')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {t('packages.professional.subtitle')}
                  </Typography>
                  
                  {/* PROFESYONEL PAKET İNDİRİMLİ FİYAT ALANI */}
                  <Box sx={{ my: { xs: 2, sm: 3 } }}>
                    <Typography variant="h5" sx={{ color: 'text.disabled', textDecoration: 'line-through', mb: -1, fontWeight: 'bold' }}>
                      {t('packages.professional.price')}
                    </Typography>
                    <Typography variant="h3" fontWeight="900" sx={{ color: '#D32F2F', display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' } }}>
                      {packages.professional.price} USD 
                      <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 1, fontWeight: 'medium' }}>
                         {t('packages.professional.period')}
                      </Typography>
                    </Typography>
                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                        {t('packages.professional.yearlyNote')}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: '#D32F2F' }}>
                        {packages.professional.yearlyPrice} USD 
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: '#1565C0', mt: 0.5 }}>
                        {t('packages.professional.yearlyCreditsNote')}
                      </Typography>
                    </Box>
                  </Box>
                  <List sx={{ flexGrow: 1 }}>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.professional.searchLimit')} primaryTypographyProps={{ fontWeight: 'bold' }} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.professional.feature1')} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.professional.feature2')} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.professional.feature3')} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.professional.feature4')} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.professional.feature5')} />
                    </ListItem>
                  </List>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => handleAddToCart('professional')}
                    sx={{
                      mt: 3,
                      bgcolor: '#1565C0',
                      borderRadius: '12px',
                      py: 1.5,
                      fontWeight: 'bold',
                      boxShadow: '0 4px 12px rgba(21, 101, 192, 0.4)',
                      '&:hover': {
                        bgcolor: '#0D47A1',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(21, 101, 192, 0.5)',
                      },
                    }}
                  >
                    {t('packages.addToCart')}
                  </Button>
                </CardContent>
              </FeatureCard>
            </Box>

            {/* Kurumsal Paket */}
            <Box sx={{ flex: '1 1 100%', minWidth: { sm: '320px', md: '350px' }, maxWidth: { xs: '100%', sm: '400px' }, display: 'flex' }}>
              <FeatureCard sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardContent sx={{ p: { xs: 3, sm: 4 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#1565C0', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                    {t('packages.enterprise.name')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {t('packages.enterprise.subtitle')}
                  </Typography>
                  
                  {/* KURUMSAL PAKET İNDİRİMLİ FİYAT ALANI */}
                  <Box sx={{ my: { xs: 2, sm: 3 } }}>
                    <Typography variant="h5" sx={{ color: 'text.disabled', textDecoration: 'line-through', mb: -1, fontWeight: 'bold' }}>
                      {t('packages.enterprise.price')}
                    </Typography>
                    <Typography variant="h3" fontWeight="900" sx={{ color: '#D32F2F', display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' } }}>
                      {packages.enterprise.price} USD 
                      <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 1, fontWeight: 'medium' }}>
                         {t('packages.enterprise.period')}
                      </Typography>
                    </Typography>
                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                        {t('packages.enterprise.yearlyNote')}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: '#D32F2F' }}>
                        {packages.enterprise.yearlyPrice} USD 
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: '#1565C0', mt: 0.5 }}>
                        {t('packages.enterprise.yearlyCreditsNote')}
                      </Typography>
                    </Box>
                  </Box>

                  <List sx={{ flexGrow: 1 }}>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.enterprise.searchLimit')} primaryTypographyProps={{ fontWeight: 'bold' }} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.enterprise.feature1')} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.enterprise.feature2')} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.enterprise.feature3')} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.enterprise.feature4')} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#1565C0' }} /></ListItemIcon>
                      <ListItemText primary={t('packages.enterprise.feature5')} />
                    </ListItem>
                  </List>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => handleAddToCart('enterprise')}
                    sx={{
                      mt: 3,
                      borderColor: '#1565C0',
                      color: '#1565C0',
                      borderWidth: 2,
                      borderRadius: '12px',
                      py: 1.5,
                      fontWeight: 'bold',
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: '#0D47A1',
                        bgcolor: 'rgba(21, 101, 192, 0.05)',
                      },
                    }}
                  >
                    {t('packages.addToCart')}
                  </Button>
                </CardContent>
              </FeatureCard>
            </Box>
          </Box>
        </Container>
      </Box>



      {/* --- HAKKIMIZDA BÖLÜMü --- */}
      <Box id="about" sx={{ py: 12, bgcolor: 'transparent', position: 'relative' }}>
        {/* Dekoratif ikonlar */}
        <Box sx={{ position: 'absolute', top: 100, right: 100, opacity: 0.03 }}>
          <GroupsIcon sx={{ fontSize: 200, color: 'white' }} />
        </Box>

        <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8, lg: 10, xl: 12 } }}>
          <Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: '300px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <VerifiedIcon sx={{ color: '#FFFFFF', fontSize: 40, mr: 2 }} />
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#FFFFFF' }}>{t('about.title')}</Typography>
              </Box>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: '#E3F2FD', lineHeight: 1.8 }}>
                {t('about.description')}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#FFFFFF', lineHeight: 1.8 }}>
                <TrendingUpIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                {t('about.reliableInfra')}
              </Typography>

              {/* İstatistikler */}
              <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
                <Box sx={{ textAlign: 'center', bgcolor: 'rgba(255,255,255,0.15)', p: 2, borderRadius: 2, flex: 1, backdropFilter: 'blur(10px)' }}>
                  <SpeedIcon sx={{ color: '#FFFFFF', fontSize: 40 }} />
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#FFFFFF' }}>%99.9</Typography>
                  <Typography variant="body2" sx={{ color: '#E3F2FD' }}>{t('about.uptime')}</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', bgcolor: 'rgba(255,255,255,0.15)', p: 2, borderRadius: 2, flex: 1, backdropFilter: 'blur(10px)' }}>
                  <AnalyticsIcon sx={{ color: '#FFFFFF', fontSize: 40 }} />
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#FFFFFF' }}>24/7</Typography>
                  <Typography variant="body2" sx={{ color: '#E3F2FD' }}>{t('about.support')}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ flex: 1, minWidth: '300px' }} id="contact">
              <Card sx={{ borderRadius: '20px', p: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
                <CardContent>
                  <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1565C0' }}>{t('about.contactUs')}</Typography>
                  <Stack spacing={3} mt={3}>
                    <Box display="flex" alignItems="center">
                      <EmailIcon sx={{ color: '#1565C0', mr: 2, fontSize: 30 }} />
                      <Typography
                        variant="body1"
                        sx={{ color: '#333' }}
                        component="a"
                        href="mailto:info@fgstrade.com"
                      >
                        info@fgstrade.com
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <PublicIcon sx={{ color: '#1565C0', mr: 2, fontSize: 30 }} />
                      <Typography
                        variant="body1"
                        sx={{ color: '#333' }}
                        component="a"
                        href="https://www.fortexglobe.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        www.fortexglobe.com
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <BusinessIcon sx={{ color: '#1565C0', mr: 2, fontSize: 30 }} />
                      <Typography
                        variant="body1"
                        sx={{ color: '#333' }}
                        component="a"
                        href="https://www.linkedin.com/company/108605401"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn Profili
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <InstagramIcon sx={{ color: '#1565C0', mr: 2, fontSize: 30 }} />
                      <Typography
                        variant="body1"
                        sx={{ color: '#333' }}
                        component="a"
                        href="https://www.instagram.com/fgstrade?igsh=MWVlb2J1YjJxaTE0NA=="
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Instagram
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <FacebookIcon sx={{ color: '#1565C0', mr: 2, fontSize: 30 }} />
                      <Typography
                        variant="body1"
                        sx={{ color: '#333' }}
                        component="a"
                        href="https://www.facebook.com/share/1G5iZZa4YU/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* --- GERİBİLDİRİM FORMU (Bize Ulaşın Altında) --- */}
              <Box id="feedback" sx={{ mt: 4 }}>
                <FeedbackCard sx={{ p: { xs: 3, sm: 4 } }}>
                  <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#1565C0', mb: 3 }}>
                      {t('feedback.heading')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                      {t('feedback.description')}
                    </Typography>

                    <Box component="form" onSubmit={handleFeedbackSubmit}>
                      <Stack spacing={3} sx={{ mt: 3 }}>
                        {/* Ad Soyad */}
                        <StyledTextField
                          fullWidth
                          label={t('feedback.fullName')}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value.slice(0, 100))}
                          placeholder={t('feedback.fullNamePlaceholder')}
                          InputProps={{
                            startAdornment: (
                              <Box sx={{ mr: 1, display: 'flex' }}>
                                <PersonIcon sx={{ color: 'action.active', fontSize: 24 }} />
                              </Box>
                            ),
                          }}
                          helperText={`${fullName.length}/100`}
                        />

                        {/* Email */}
                        <StyledTextField
                          fullWidth
                          label={t('feedback.email')}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t('feedback.emailPlaceholder')}
                          InputProps={{
                            startAdornment: (
                              <Box sx={{ mr: 1, display: 'flex' }}>
                                <EmailIcon sx={{ color: 'action.active', fontSize: 24 }} />
                              </Box>
                            ),
                          }}
                        />

                        {/* Telefon */}
                        <StyledTextField
                          fullWidth
                          label={t('feedback.phone')}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.slice(0, 20))}
                          placeholder={t('feedback.phonePlaceholder')}
                          InputProps={{
                            startAdornment: (
                              <Box sx={{ mr: 1, display: 'flex' }}>
                                <PhoneIcon sx={{ color: 'action.active', fontSize: 24 }} />
                              </Box>
                            ),
                          }}
                          helperText={`${phone.length}/20`}
                        />

                        {/* Başlık */}
                        <StyledTextField
                          fullWidth
                          label={t('feedback.subject')}
                          value={subject}
                          onChange={(e) => setSubject(e.target.value.slice(0, 255))}
                          placeholder={t('feedback.subjectPlaceholder')}
                          helperText={`${subject.length}/255`}
                        />

                        {/* Şikayet Türü (Opsiyonel) */}
                        <StyledFormControl fullWidth>
                          <InputLabel sx={{ color: '#666' }}>{t('feedback.typeLabel')}</InputLabel>
                          <Select
                            value={feedbackType}
                            label={t('feedback.typeLabel')}
                            onChange={(e) => setFeedbackType(e.target.value)}
                            sx={{
                              borderRadius: '14px',
                              backgroundColor: '#F8F9FA',
                            }}
                          >
                            <MenuItem value="">{t('feedback.selectOption')}</MenuItem>
                            <MenuItem value="complaint">{t('feedback.complaint')}</MenuItem>
                            <MenuItem value="suggestion">{t('feedback.suggestion')}</MenuItem>
                            <MenuItem value="problem">{t('feedback.problem')}</MenuItem>
                            <MenuItem value="feedback">{t('feedback.other')}</MenuItem>
                          </Select>
                        </StyledFormControl>

                        {/* Mesaj */}
                        <StyledTextField
                          fullWidth
                          label={t('feedback.message')}
                          multiline
                          rows={6}
                          value={message}
                          onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
                          placeholder={t('feedback.messagePlaceholder')}
                          helperText={`${message.length}/2000`}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />

                        {/* Gönder Butonu */}
                        <SubmitButton
                          type="submit"
                          fullWidth
                          disabled={feedbackLoading}
                          size="large"
                        >
                          {feedbackLoading ? t('feedback.sending') : t('feedback.submitButton')}
                        </SubmitButton>
                      </Stack>
                    </Box>

                    {/* Başarı Mesajı */}
                    <Snackbar
                      open={feedbackSuccess}
                      autoHideDuration={3000}
                      onClose={() => setFeedbackSuccess(false)}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                      <Alert severity="success" sx={{ borderRadius: 2 }}>
                        {t('feedback.successMessage')}
                      </Alert>
                    </Snackbar>

                    {/* Hata Mesajı */}
                    <Snackbar
                      open={!!feedbackError}
                      autoHideDuration={4000}
                      onClose={() => setFeedbackError('')}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                      <Alert severity="error" sx={{ borderRadius: 2 }}>
                        {feedbackError}
                      </Alert>
                    </Snackbar>
                  </CardContent>
                </FeedbackCard>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* --- FOOTER --- */}
      <Footer>
        
        <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8, lg: 10, xl: 12 } }}>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
            {/* Sol taraf - FGS TRADE Logo ve Tagline */}
            <Box sx={{ flex: 1, minWidth: '200px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  component="img"
                  src={logoImage}
                  alt="Trade Scout Logo"
                  sx={{
                    height: { xs: 70, sm: 85, md: 95 },
                    width: 'auto',
                    mr: 1.5
                  }}
                />
                <Typography variant="h5" fontWeight="bold">FGS TRADE</Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                <RocketLaunchIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                {t('footer.tagline')}
              </Typography>
            </Box>

        <Box
          component="img"
          src={paratikaLogo}
          alt="Morpara Sanal POS"
          sx={{
            height: { xs: '60px', md: '80px' }, // Boyutu önemli ölçüde büyüttük (örneğin 30px yerine 60/80px)
            width: 'auto',
            opacity: 0.9,
            marginLeft: 'auto' // Sağa yaslamak için (gerekirse ayarlayın)
          }}
        />
            {/* Sağ taraf - Iyzico Logoları (FGS TRADE ile aynı hizada) */}

          </Box>

          {/* Alt kısım - Yasal Linkler, Copyright ve Güvenli Ödeme */}
          <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', my: 2 }} />

          {/* Yasal Linkler */}
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: { xs: 1.5, md: 3 },
            mb: 2
          }}>
            <Link
              to="/hakkimizda"
              style={{
                opacity: 0.8,
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Typography variant="body2" sx={{ '&:hover': { opacity: 1, textDecoration: 'underline' } }}>
                {t('footer.about')}
              </Typography>
            </Link>
            <Link
              to="/gizlilik"
              style={{
                opacity: 0.8,
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Typography variant="body2" sx={{ '&:hover': { opacity: 1, textDecoration: 'underline' } }}>
                {t('footer.privacy')}
              </Typography>
            </Link>
            <Link
              to="/kullanim-sartlari"
              style={{
                opacity: 0.8,
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Typography variant="body2" sx={{ '&:hover': { opacity: 1, textDecoration: 'underline' } }}>
                {t('footer.terms')}
              </Typography>
            </Link>
            <Link
              to="/iade-politikasi"
              style={{
                opacity: 0.8,
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Typography variant="body2" sx={{ '&:hover': { opacity: 1, textDecoration: 'underline' } }}>
                {t('footer.refund')}
              </Typography>
            </Link>
            <Link
              to="/mesafeli-satis"
              style={{
                opacity: 0.8,
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Typography variant="body2" sx={{ '&:hover': { opacity: 1, textDecoration: 'underline' } }}>
                {t('footer.distanceSales')}
              </Typography>
            </Link>
          </Box>
        </Container>
      </Footer>

    </PageContainer>
  );
};

export default LandingPage;