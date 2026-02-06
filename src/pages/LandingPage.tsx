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
  Divider
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
// Logo import - FGSTrade
import logoImage from '../assent/fgs-logo.png';

// --- STİL TANIMLAMALARI ---

const PageContainer = styled(Box)({
  minHeight: '100vh',
  width: '100%',
  background: 'linear-gradient(180deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)',
  overflowX: 'hidden',
});

// Üst Menü (Navbar)
const StyledAppBar = styled(AppBar)({
  background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.98) 0%, rgba(227, 242, 253, 0.95) 15%, rgba(21, 101, 192, 0.95) 35%, rgba(21, 101, 192, 0.95) 100%)',
  boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
  backdropFilter: 'blur(10px)',
});

const LogoImage = styled('img')(({ theme }) => ({
  height: '65px',
  width: 'auto',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  [theme.breakpoints.down('md')]: {
    height: '52px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '42px',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: '#1565C0',
  fontSize: '1.4rem',
  cursor: 'pointer',
  marginLeft: '10px',
  textShadow: '0 1px 2px rgba(255,255,255,0.3)',
  [theme.breakpoints.down('lg')]: {
    fontSize: '1.2rem',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem',
    marginLeft: '8px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.85rem',
    marginLeft: '6px',
  },
}));

const NavButton = styled(Button)({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  color: '#FFFFFF',
  marginLeft: '0.8rem',
  padding: '6px 12px',
  '&:hover': {
    color: '#E3F2FD',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});

const LoginButton = styled(Button)({
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.9rem',
  borderRadius: '10px',
  padding: '6px 20px',
  background: '#1565C0',
  color: '#FFFFFF',
  marginLeft: '1.5rem',
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
    padding: theme.spacing(10, 0, 6),
    minHeight: '70vh',
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

// --- COMPONENT ---

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  return (
    <PageContainer>
      {/* --- NAVBAR --- */}
      <StyledAppBar position="fixed" color="default">
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 6, md: 8, lg: 10, xl: 12 } }}>
          <Toolbar disableGutters sx={{ py: { xs: 0.5, md: 0.8 }, minHeight: { xs: '56px', md: '64px' } }}>
            {/* Logo */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
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
                sx={{ fontSize: { md: '0.85rem', lg: '0.95rem' }, fontWeight: 'bold' }}
              >
                Özellikler
              </NavButton>
              <NavButton 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                sx={{ fontSize: { md: '0.85rem', lg: '0.95rem' }, fontWeight: 'bold' }}
              >
                Hakkımızda
              </NavButton>
              <NavButton 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                sx={{ fontSize: { md: '0.85rem', lg: '0.95rem' }, fontWeight: 'bold' }}
              >
                Bize Ulaşın
              </NavButton>
              <NavButton 
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                sx={{ fontSize: { md: '0.85rem', lg: '0.95rem' }, fontWeight: 'bold' }}
              >
                Paketler
              </NavButton>
              
            </Box>

            {/* Giriş Yap Butonu (Desktop) */}
            <LoginButton 
              onClick={() => navigate('/login')}
              sx={{ 
                display: { xs: 'none', md: 'inline-flex' },
                ml: { md: 1 }
              }}
            >
              Giriş Yap
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
            Menü
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
                primary="Özellikler" 
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
                primary="Hakkımızda" 
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
                primary="Bize Ulaşın" 
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
                primary="Paketler" 
                primaryTypographyProps={{ fontWeight: 600, fontSize: '1.1rem' }}
              />
            </ListItemButton>
          </ListItem>
        </List>

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
            Giriş Yap
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
            Kayıt Ol
          </Button>
        </Box>
      </Drawer>

      {/* --- HERO SECTION --- */}
      <HeroSection>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 8, lg: 10, xl: 12 } }}>
          <Box sx={{ display: 'flex', gap: { xs: 3, md: 8 }, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: '280px', maxWidth: { md: '600px' } }}>
              <Typography variant="h6" sx={{ color: '#E3F2FD', fontWeight: 'bold', mb: 2, fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}>
                YENİ NESİL TİCARİ İSTİHBARAT
              </Typography>
              <HeroTitle variant="h2" sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' } }}>
                Potansiyel Müşterilerinizi <br />
                <span style={{ color: '#E3F2FD' }}>Saniyeler İçinde Bulun</span>
              </HeroTitle>
              <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 4, lineHeight: 1.8, fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem', lg: '1.25rem' } }}>
                Google Haritalar ve gelişmiş veri madenciliği teknolojisi ile sektörünüzdeki binlerce firmaya tek tıkla ulaşın. İhracatınızı ve satışlarınızı artırın.
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
                  Hemen Başla
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
                  Daha Fazla Bilgi
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
                      <Typography variant="body2">Firma</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', color: 'white' }}>
                      <GroupsIcon sx={{ fontSize: 60, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">500+</Typography>
                      <Typography variant="body2">Müşteri</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', color: 'white' }}>
                      <SpeedIcon sx={{ fontSize: 60, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">%95</Typography>
                      <Typography variant="body2">Başarı</Typography>
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
                      Hızlı & Güvenilir
                    </Typography>
                    <Typography variant="body1" color="rgba(255,255,255,0.9)">
                      Yapay zeka destekli sistemimiz ile saniyeler içinde binlerce potansiyel müşteriye ulaşın.
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
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>NEDEN TRADESCOUT?</Typography>
            </Box>
            <Typography variant="h3" fontWeight="800" mt={1} sx={{ color: '#FFFFFF' }}>İşinizi Büyütmek İçin Güçlü Araçlar</Typography>
            <Typography variant="body1" sx={{ color: '#E3F2FD', maxWidth: '600px', mx: 'auto' }} mt={2}>
              Modern teknoloji ve yapay zeka ile işinizi bir üst seviyeye taşıyın
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Kart 1 */}
            <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <FeatureCard>
                <CardContent sx={{ p: 4 }}>
                  <IconWrapper><PublicIcon fontSize="large" /></IconWrapper>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>Global Veri Erişimi</Typography>
                  <Typography color="text.secondary">
                    Sadece Türkiye değil, tüm dünyadaki potansiyel müşterilerinizi lokasyon bazlı tarayın ve bulun.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Box>
            {/* Kart 2 */}
            <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <FeatureCard>
                <CardContent sx={{ p: 4 }}>
                  <IconWrapper><SavedSearchIcon fontSize="large" /></IconWrapper>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>Akıllı Filtreleme</Typography>
                  <Typography color="text.secondary">
                    Sektör, şehir ve anahtar kelimeye göre detaylı arama yapın. Sadece ihtiyacınız olan firmalara odaklanın.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Box>
            {/* Kart 3 */}
            <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <FeatureCard>
                <CardContent sx={{ p: 4 }}>
                  <IconWrapper><BusinessIcon fontSize="large" /></IconWrapper>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>Excel Raporlama</Typography>
                  <Typography color="text.secondary">
                    Bulduğunuz binlerce firmanın telefon ve e-posta bilgilerini tek tıkla Excel formatında indirin.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* --- FİYATLANDIRMA VE PAKETLER --- */}
      <Box id="packages" sx={{ py: 12, bgcolor: 'rgba(255,255,255,0.1)', position: 'relative' }}>
        {/* Dekoratif ikonlar */}
        <Box sx={{ position: 'absolute', top: 50, left: 50, opacity: 0.05 }}>
          <StarIcon sx={{ fontSize: 150, color: 'white' }} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: 50, right: 50, opacity: 0.05 }}>
          <RocketLaunchIcon sx={{ fontSize: 150, color: 'white' }} />
        </Box>
        
        <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8, lg: 10, xl: 12 } }}>
          <Box textAlign="center" mb={8}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <StarIcon sx={{ color: '#FFFFFF' }} />
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>FİYATLANDIRMA</Typography>
            </Box>
            <Typography variant="h3" fontWeight="800" mt={1} sx={{ color: '#FFFFFF' }}>Size Uygun Paketi Seçin</Typography>
            <Typography variant="body1" sx={{ color: '#E3F2FD', maxWidth: '600px', mx: 'auto' }} mt={2}>
              İşletmenizin ihtiyaçlarına göre esnek paketlerimizden birini seçin
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
                    Başlangıç Paketi
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Yeni başlayanlar için ideal
                  </Typography>
                  <Box sx={{ my: { xs: 2, sm: 3 } }}>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#1565C0', fontSize: { xs: '2rem', sm: '3rem' } }}>
                      $7.5
                      <Typography component="span" variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        /ay
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Yıllık ödenirse | Aylık: $5
                    </Typography>
                  </Box>
                  <List sx={{ flexGrow: 1 }}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary="Aylık 15 Arama" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary="Temel Excel Raporu" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary="E-posta Desteği" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary="Temel Filtreleme" />
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
                    Hemen Başla
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
                  label="EN POPÜLER"
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
                    Profesyonel Paket
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Büyüyen işletmeler için
                  </Typography>
                  <Box sx={{ my: { xs: 2, sm: 3 } }}>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#1565C0', fontSize: { xs: '2rem', sm: '3rem' } }}>
                      $15
                      <Typography component="span" variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        /ay
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Yıllık ödenirse | Aylık: $10
                    </Typography>
                  </Box>
                  <List sx={{ flexGrow: 1 }}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary="Aylık 25 Arama" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary="Detaylı İletişim Bilgileri" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary="Gelişmiş Excel Raporu" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary="Öncelikli Destek" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary="Gelişmiş Filtreleme" />
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
                    Hemen Başla
                  </Button>
                </CardContent>
              </FeatureCard>
            </Box>

            {/* Kurumsal Paket */}
            <Box sx={{ flex: '1 1 100%', minWidth: { sm: '320px', md: '350px' }, maxWidth: { xs: '100%', sm: '400px' }, display: 'flex' }}>
              <FeatureCard sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardContent sx={{ p: { xs: 3, sm: 4 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#1565C0', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                    Kurumsal Paket
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Büyük ekipler için
                  </Typography>
                  <Box sx={{ my: { xs: 2, sm: 3 } }}>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#1565C0', fontSize: { xs: '2rem', sm: '3rem' } }}>
                      $75
                      <Typography component="span" variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        /ay
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Yıllık ödenirse | Aylık: $50
                    </Typography>
                  </Box>
                  <List sx={{ flexGrow: 1 }}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary="Aylık 75 Arama" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary="API Erişimi" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary="Özel Excel Şablonları" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary="7/24 Canlı Destek" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary="Özel Müşteri Temsilcisi" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#1565C0' }} />
                      </ListItemIcon>
                      <ListItemText primary="Eğitim ve Onboarding" />
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
                    Hemen Başla
                  </Button>
                </CardContent>
              </FeatureCard>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* --- HAKKIMIZDA & İLETİŞİM --- */}
      <Box id="about" sx={{ py: 12, bgcolor: 'rgba(0,0,0,0.1)', position: 'relative' }}>
        {/* Dekoratif ikonlar */}
        <Box sx={{ position: 'absolute', top: 100, right: 100, opacity: 0.03 }}>
          <GroupsIcon sx={{ fontSize: 200, color: 'white' }} />
        </Box>
        
        <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8, lg: 10, xl: 12 } }}>
          <Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: '300px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <VerifiedIcon sx={{ color: '#FFFFFF', fontSize: 40, mr: 2 }} />
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#FFFFFF' }}>Hakkımızda</Typography>
              </Box>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: '#E3F2FD', lineHeight: 1.8 }}>
                FGS TRADE, işletmelerin yeni pazarlar bulmasını kolaylaştıran yapay zeka destekli bir veri platformudur.
                Amacımız, karmaşık veri madenciliği süreçlerini basitleştirerek KOBİ'lerin ve ihracatçıların
                dünya pazarlarına açılmasını sağlamaktır.
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#FFFFFF', lineHeight: 1.8 }}>
                <TrendingUpIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Güvenilir altyapımız ve güncel veri tabanımızla ticaretin rotasını siz çiziyorsunuz.
              </Typography>
              
              {/* İstatistikler */}
              <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
                <Box sx={{ textAlign: 'center', bgcolor: 'rgba(255,255,255,0.15)', p: 2, borderRadius: 2, flex: 1, backdropFilter: 'blur(10px)' }}>
                  <SpeedIcon sx={{ color: '#FFFFFF', fontSize: 40 }} />
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#FFFFFF' }}>%99.9</Typography>
                  <Typography variant="body2" sx={{ color: '#E3F2FD' }}>Uptime</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', bgcolor: 'rgba(255,255,255,0.15)', p: 2, borderRadius: 2, flex: 1, backdropFilter: 'blur(10px)' }}>
                  <AnalyticsIcon sx={{ color: '#FFFFFF', fontSize: 40 }} />
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#FFFFFF' }}>24/7</Typography>
                  <Typography variant="body2" sx={{ color: '#E3F2FD' }}>Destek</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ flex: 1, minWidth: '300px' }} id="contact">
              <Card sx={{ borderRadius: '20px', p: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
                <CardContent>
                  <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1565C0' }}>Bize Ulaşın</Typography>
                  <Stack spacing={3} mt={3}>
                    <Box display="flex" alignItems="center">
                      <LocationOnIcon sx={{ color: '#1565C0', mr: 2, fontSize: 30 }} />
                      <Typography variant="body1" sx={{ color: '#333' }}>Teknopark, Düzce Üniversitesi, Düzce/Türkiye</Typography>
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
                Ticaretin yeni rotası. Veri odaklı büyüme platformu.
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: '200px', textAlign: { md: 'right' } }}>
              <Typography variant="body2" sx={{ opacity: 0.6 }}>
                © 2026 FGS TRADE. Tüm hakları saklıdır. Gizlilik Politikası | Kullanım Şartları
              </Typography>
            </Box>
          </Box>
        </Container>
      </Footer>

    </PageContainer>
  );
};

export default LandingPage;