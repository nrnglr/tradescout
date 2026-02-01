import React from 'react';
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
  Stack
} from '@mui/material';

import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import GroupsIcon from '@mui/icons-material/Groups';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedIcon from '@mui/icons-material/Verified';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import logoImage from '../assent/image-1769925776006.png';

// --- STİL TANIMLAMALARI ---

const BRAND_COLORS = {
  primary: '#1565C0',       // Koyu mavi
  primaryHover: '#0D47A1',  // Daha koyu mavi
  secondary: '#1976D2',     // Orta mavi
  lightBlue: '#42A5F5',     // Açık mavi
  textLight: '#FFFFFF',     // Beyaz yazı
  textDark: '#E3F2FD',      // Açık mavi yazı
  gradient: 'linear-gradient(135deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)', // Mavi gradient
  gradientReverse: 'linear-gradient(135deg, #42A5F5 0%, #1976D2 50%, #1565C0 100%)',
  bgLight: '#E3F2FD',       // Açık mavi arka plan
  cardBg: 'rgba(255, 255, 255, 0.95)', // Beyaz kartlar
};

const PageContainer = styled(Box)({
  minHeight: '100vh',
  width: '100%',
  background: 'linear-gradient(180deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)',
  overflowX: 'hidden',
});

// Üst Menü (Navbar)
const StyledAppBar = styled(AppBar)({
  background: 'rgba(21, 101, 192, 0.95)',
  boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
  backdropFilter: 'blur(10px)',
});

const LogoImage = styled('img')({
  height: '55px',
  width: 'auto',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const LogoText = styled(Typography)({
  fontWeight: 800,
  color: '#FFFFFF',
  fontSize: '1.8rem',
  cursor: 'pointer',
  marginLeft: '12px',
  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
});

const NavButton = styled(Button)({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  color: '#FFFFFF',
  marginLeft: '1rem',
  '&:hover': {
    color: '#E3F2FD',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

const LoginButton = styled(Button)({
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1rem',
  borderRadius: '12px',
  padding: '8px 24px',
  background: '#FFFFFF',
  color: '#1565C0',
  marginLeft: '1.5rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  '&:hover': {
    background: '#E3F2FD',
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

  return (
    <PageContainer>
      {/* --- NAVBAR --- */}
      <StyledAppBar position="fixed" color="default">
        <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8, lg: 10, xl: 12 } }}>
          <Toolbar disableGutters sx={{ py: 1 }}>
            {/* Logo */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <LogoImage 
                src={logoImage} 
                alt="Trade Scout Logo" 
                onClick={() => window.scrollTo(0, 0)}
              />
              <LogoText onClick={() => window.scrollTo(0, 0)}>
                Trade Scout
              </LogoText>
            </Box>

            {/* Menü Linkleri (Masaüstü) */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <NavButton onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Özellikler
              </NavButton>
              <NavButton onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                Hakkımızda
              </NavButton>
              <NavButton onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Bize Ulaşın
              </NavButton>
            </Box>

            {/* Giriş Yap Butonu */}
            <LoginButton onClick={() => navigate('/login')}>
              Giriş Yap
            </LoginButton>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* --- HERO SECTION --- */}
      <HeroSection>
        <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8, lg: 10, xl: 12 } }}>
          <Box sx={{ display: 'flex', gap: { xs: 4, md: 8 }, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: '300px', maxWidth: { md: '600px' } }}>
              <Typography variant="h6" sx={{ color: '#E3F2FD', fontWeight: 'bold', mb: 2 }}>
                YENİ NESİL TİCARİ İSTİHBARAT
              </Typography>
              <HeroTitle variant="h2" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                Potansiyel Müşterilerinizi <br />
                <span style={{ color: '#E3F2FD' }}>Saniyeler İçinde Bulun</span>
              </HeroTitle>
              <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 4, lineHeight: 1.8, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                Google Haritalar ve gelişmiş veri madenciliği teknolojisi ile sektörünüzdeki binlerce firmaya tek tıkla ulaşın. İhracatınızı ve satışlarınızı artırın.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    bgcolor: '#FFFFFF',
                    color: '#1565C0',
                    borderRadius: '12px', 
                    fontSize: '1.1rem', 
                    px: 4, 
                    py: 1.5,
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
                    fontSize: '1.1rem', 
                    px: 4, 
                    py: 1.5,
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
            <Box sx={{ flex: 1, minWidth: '300px', position: 'relative' }}>
              <Box 
                sx={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '24px',
                  padding: 6,
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
                Trade Scout, işletmelerin yeni pazarlar bulmasını kolaylaştıran yapay zeka destekli bir veri platformudur.
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
                      <EmailIcon sx={{ color: '#1565C0', mr: 2, fontSize: 30 }} />
                      <Typography variant="body1" sx={{ color: '#333' }}>info@tradescout.com</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <PhoneIcon sx={{ color: '#1565C0', mr: 2, fontSize: 30 }} />
                      <Typography variant="body1" sx={{ color: '#333' }}>+90 850 123 45 67</Typography>
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
                  sx={{ height: 50, width: 'auto', mr: 1.5 }}
                />
                <Typography variant="h5" fontWeight="bold">Trade Scout</Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                <RocketLaunchIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                Ticaretin yeni rotası. Veri odaklı büyüme platformu.
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: '200px', textAlign: { md: 'right' } }}>
              <Typography variant="body2" sx={{ opacity: 0.6 }}>
                © 2026 Trade Scout. Tüm hakları saklıdır. Gizlilik Politikası | Kullanım Şartları
              </Typography>
            </Box>
          </Box>
        </Container>
      </Footer>

    </PageContainer>
  );
};

export default LandingPage;