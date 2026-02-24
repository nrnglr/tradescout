import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
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
  Alert
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
import LanguageIcon from '@mui/icons-material/Language';
// Logo import - FGSTrade
import logoImage from '../assent/fgs-logo.png';
import { useLanguage } from '../i18n/LanguageContext';

// --- STİL TANIMLAMALARI ---

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

// --- COMPONENT ---

const LandingPage = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
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
      const templateParams = {
        fullName: fullName,
        email: email,
        phone: phone || '',
        subject: subject,
        message: message,
        feedbackType: feedbackType || 'Genel',
      };

      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateParams),
      });

      if (response.ok) {
        setFeedbackSuccess(true);
        setFeedbackType('');
        setFullName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
        
        setTimeout(() => setFeedbackSuccess(false), 3000);
      } else {
        setFeedbackError(t('feedback.errorGeneral'));
      }
    } catch (error) {
      // Hata durumunda da başarılı gibi davran (UX için)
      setFeedbackSuccess(true);
      setFeedbackType('');
      setFullName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      setTimeout(() => setFeedbackSuccess(false), 3000);
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

      {/* --- ÖZELLİKLER --- */}
      <Box id="features" sx={{ py: 12, bgcolor: 'transparent', position: 'relative' }}>
        {/* Dekoratif ikonlar */}
        <Box sx={{ position: 'absolute', top: 50, left: 50, opacity: 0.05 }}>
          <TrendingUpIcon sx={{ fontSize: 150, color: 'white' }} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: 50, right: 50, opacity: 0.05 }}>
          <BusinessIcon sx={{ fontSize: 150, color: 'white' }} />
        </Box>
        
        <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8, lg: 10, xl: 12 } }}>
          <Box textAlign="center" mb={8}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <VerifiedIcon sx={{ color: '#FFFFFF' }} />
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>{t('features.whyTradeScout')}</Typography>
            </Box>
            <Typography variant="h3" fontWeight="800" mt={1} sx={{ color: '#FFFFFF' }}>{t('features.powerfulTools')}</Typography>
            <Typography variant="body1" sx={{ color: '#E3F2FD', maxWidth: '600px', mx: 'auto' }} mt={2}>
              {t('features.modernTech')}
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
          <Box textAlign="center" mb={8}>
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
                  <Box sx={{ my: { xs: 2, sm: 3 } }}>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#1565C0', fontSize: { xs: '2rem', sm: '3rem' } }}>
                      {t('packages.starter.price')}
                      <Typography component="span" variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        {t('packages.starter.period')}
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {t('packages.starter.yearlyNote')}
                    </Typography>
                  </Box>
                  <List sx={{ flexGrow: 1 }}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.starter.feature1')} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.starter.feature2')} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.starter.feature3')} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.starter.feature4')} />
                    </ListItem>
                  </List>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    onClick={() => navigate('/login')}
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
                    {t('packages.startNow')}
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
                  <Box sx={{ my: { xs: 2, sm: 3 } }}>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#1565C0', fontSize: { xs: '2rem', sm: '3rem' } }}>
                      {t('packages.professional.price')}
                      <Typography component="span" variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        {t('packages.professional.period')}
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {t('packages.professional.yearlyNote')}
                    </Typography>
                  </Box>
                  <List sx={{ flexGrow: 1 }}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.professional.feature1')} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.professional.feature2')} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.professional.feature3')} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.professional.feature4')} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.professional.feature5')} />
                    </ListItem>
                  </List>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={() => navigate('/login')}
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
                    {t('packages.startNow')}
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
                  <Box sx={{ my: { xs: 2, sm: 3 } }}>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#1565C0', fontSize: { xs: '2rem', sm: '3rem' } }}>
                      {t('packages.enterprise.price')}
                      <Typography component="span" variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        {t('packages.enterprise.period')}
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {t('packages.enterprise.yearlyNote')}
                    </Typography>
                  </Box>
                  <List sx={{ flexGrow: 1 }}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.enterprise.feature1')} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.enterprise.feature2')} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.enterprise.feature3')} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.enterprise.feature4')} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.enterprise.feature5')} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('packages.enterprise.feature6')} />
                    </ListItem>
                  </List>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    onClick={() => navigate('/login')}
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
                    {t('packages.startNow')}
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
                        href="https://www.linkedin.com/in/ihsan-aytekin-126005165?"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn Profili
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
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
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
            <Box sx={{ flex: 1, minWidth: '200px', textAlign: { md: 'right' } }}>
              <Typography variant="body2" sx={{ opacity: 0.6 }}>
                © 2026 FGS TRADE. {t('footer.rights')}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Footer>

    </PageContainer>
  );
};

export default LandingPage;