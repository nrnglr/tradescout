import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  InputAdornment,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  Container,
  Toolbar,
  AppBar,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import HomeIcon from '@mui/icons-material/Home';
// Logo import - FGSTrade
import logoImage from '../assent/fgs-logo.png';
import loginIllustration from '../assent/login-illustration.png';
import login2Illustration from '../assent/login2-illustration.png';
import { authService } from '../services/auth';
import { useLanguage } from '../i18n/LanguageContext';

// --- STİL TANIMLAMALARI (AQUASOFT Benzeri Modern Tasarım) ---

// Marka renkleri ve gradientler (AQUASOFT tarzı mavi-beyaz uyum)
const BRAND_COLORS = {
  primary: '#1565C0',           // Ana mavi
  primaryHover: '#0D47A1',      // Hover mavi
  secondary: '#1976D2',         // İkincil mavi
  lightBlue: '#42A5F5',         // Açık mavi
  gradient: 'linear-gradient(135deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)', // Mavi gradient
  background: '#FFFFFF',        // Beyaz arka plan
  textLight: '#FFFFFF',         // Beyaz yazı
  textDark: '#E3F2FD',          // Açık mavi yazı
};

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(180deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)', // AQUASOFT benzeri gradient
  position: 'relative',
  overflowY: 'auto',
}));

const LoginContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4, 2),
  [theme.breakpoints.down('md')]: {
    alignItems: 'center',
    padding: theme.spacing(2, 1),
  },
}));

const LoginSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center', // Tek kolon olacağı için center
  width: '100%',
  maxWidth: '1300px',
  margin: '0 auto',
  gap: theme.spacing(4),
}));

// Sol ve Sağ görsel alanları (Opsiyonel: API yapısında backend'den resim gelmeyebilir, placeholder koydum)
const ImageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const Image = styled('img')(({ theme }) => ({
  maxWidth: '90%',
  height: 'auto',
  objectFit: 'contain',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.03)',
  },
  cursor: 'pointer'
}));

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
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '2.2rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.8rem',
  },
}));

const FormContainer = styled(Box)(({ theme }) => ({
  flex: 1.2,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
  maxWidth: '450px',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}));

const LoginForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5, 4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 24,
  maxWidth: 460,
  width: '100%',
  margin: '0 auto',
  background: 'rgba(255, 255, 255, 0.98)', // Beyaz arka plan (AQUASOFT benzeri)
  boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2),
    borderRadius: 16,
  },
}));

const Logo = styled('img')(({ theme }) => ({
  width: 180,
  height: 180,
  borderRadius: 24,
  marginBottom: 24,
  objectFit: 'contain',
  boxShadow: '0 8px 24px rgba(21, 101, 192, 0.3)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  [theme.breakpoints.down('sm')]: {
    width: 140,
    height: 140,
    borderRadius: 16,
    marginBottom: 16,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  '& .MuiOutlinedInput-root': {
    borderRadius: 14,
    backgroundColor: '#F8F9FA',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: '#E0E0E0',
      borderWidth: 2,
    },
    '&:hover fieldset': {
      borderColor: BRAND_COLORS.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: BRAND_COLORS.primary,
      borderWidth: 2,
    },
    '&.Mui-focused': {
      backgroundColor: '#FFFFFF',
      boxShadow: '0 4px 12px rgba(21, 101, 192, 0.1)',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: BRAND_COLORS.primary,
    fontWeight: 600,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.8),
  borderRadius: 14,
  fontWeight: 700,
  fontSize: 17,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
  color: '#FFFFFF',
  boxShadow: '0 6px 20px rgba(21, 101, 192, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 28px rgba(21, 101, 192, 0.4)',
    background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
  },
  '&:active': {
    transform: 'translateY(-1px)',
  },
}));

const SocialButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: 14,
  minWidth: 'auto',
  flex: 1,
  borderColor: '#E0E0E0',
  borderWidth: 2,
  backgroundColor: '#FFFFFF',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: BRAND_COLORS.primary,
    backgroundColor: 'rgba(21, 101, 192, 0.05)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(21, 101, 192, 0.15)',
  },
}));

// --- COMPONENT ---

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // State Yönetimi
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sayfa yüklendiğinde "Beni Hatırla" kontrolü
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validasyon
    if (!email || !password) {
      setError(t('login.errorEmpty'));
      return;
    }

    setLoading(true);

    try {
      // GERÇEK BACKEND BAĞLANTISI
      const response = await authService.login({ email, password });
      
      console.log("✅ Login başarılı!");
      console.log("📦 Response:", response);
      console.log("🔑 Token kaydedildi mi?", !!localStorage.getItem('token'));
      console.log("👤 User kaydedildi mi?", !!localStorage.getItem('user'));
      console.log("🔑 Token:", localStorage.getItem('token'));
      console.log("👤 User:", localStorage.getItem('user'));
      
      // Beni Hatırla Mantığı
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Başarılı girişte Dashboard'a yönlendir
      navigate('/dashboard');

    } catch (err: any) {
      console.error("❌ Login hatası:", err);
      setError(err.message || t('login.errorFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // Kayıt sayfasına yönlendir
  };

  const handleForgotPassword = () => {
    // Şifre sıfırlama mantığı veya modal açma
    console.log("Şifremi unuttum tıklandı");
  };

  return (
    <PageContainer>
      {/* Header Kısmı (Ana Sayfa Butonu) */}
      <StyledAppBar position="fixed" color="default">
        <Container maxWidth={false} sx={{ px: { xs: 0, sm: 1, md: 3, lg: 5, xl: 8 } }}>
          <Toolbar 
            disableGutters 
            sx={{ 
              py: { xs: 0.5, md: 0.8 }, 
              minHeight: { xs: '85px', md: '110px' },
              maxHeight: { xs: '85px', md: '110px' },
              overflow: 'hidden',
              justifyContent: 'space-between'
            }}
          >
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pl: { xs: 0, sm: 0.5 } }}>
              <LogoImage 
                src={logoImage} 
                alt="Trade Scout Logo" 
                onClick={() => navigate('/')}
              />
              <LogoText onClick={() => navigate('/')}>
                FGS TRADE
              </LogoText>
            </Box>
            
            {/* Ana Sayfa Butonu */}
            <Button
              startIcon={<HomeIcon sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />}
              onClick={() => navigate('/')}
              sx={{
                color: '#FFFFFF',
                fontWeight: 700,
                textTransform: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                borderRadius: '12px',
                padding: { xs: '8px 16px', sm: '10px 24px', md: '10px 30px' },
                backgroundColor: '#1565C0',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: '#0D47A1',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {t('navbar.home')}
            </Button>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Content - Toolbar yüksekliği kadar boşluk bırak */}
      <Box sx={{ pt: { xs: '85px', md: '110px' } }}>
        <LoginContent>
          <LoginSection>
          
          {/* Sol Görsel Alanı - İllüstrasyon */}
          <ImageContainer>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: 4,
                borderRadius: 4,
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
                },
              }}
            >
              <img 
                src={loginIllustration} 
                alt="Login Illustration" 
                style={{ 
                  width: '100%', 
                  maxWidth: '400px', 
                  height: 'auto',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
                }}
              />
              <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 800, textAlign: 'center', mt: 3, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                {t('login.heroTitle')}
              </Typography>
              <Typography variant="h6" sx={{ color: '#E3F2FD', textAlign: 'center', mt: 2, fontWeight: 500 }}>
                {t('login.heroSubtitle')}
              </Typography>
            </Box>
          </ImageContainer>

          {/* Login Form Alanı */}
          <FormContainer>
            <LoginForm elevation={5}>
              {/* Logo */}
              <Logo 
                src={logoImage} 
                alt="Trade Scout Logo" 
              />

              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800, 
                  color: '#1565C0',
                  fontSize: '2.2rem',
                  mb: 1,
                  textShadow: '0 0 20px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.9), 0 2px 10px rgba(255, 255, 255, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.15)'
                }}
              >
                {t('login.title')}
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ color: '#666', mb: 4, fontWeight: 500 }}
              >
                {t('login.subtitle')}
              </Typography>

              <Box component="form" onSubmit={handleSubmit} width="100%">
                <StyledTextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label={t('login.email')}
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <StyledTextField
                  variant="outlined"
                  fullWidth
                  name="password"
                  label={t('login.password')}
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="body2" color="text.secondary">{t('login.rememberMe')}</Typography>}
                  />
                  
                  <Button 
                    onClick={handleForgotPassword}
                    sx={{ textTransform: 'none', color: BRAND_COLORS.primary, fontWeight: 600 }}
                  >
                    {t('login.forgotPassword')}
                  </Button>
                </Box>

                <ActionButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: '#FFFFFF' }} /> : t('login.loginButton')}
                </ActionButton>

                {/* Sosyal Medya Girişleri */}
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Typography variant="caption" display="block" align="center" color="text.secondary" sx={{ mb: 2 }}>
                    {t('login.orContinue')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <SocialButton variant="outlined" onClick={() => console.log('Google Login')}>
                      <GoogleIcon sx={{ color: '#DB4437' }} />
                    </SocialButton>
                    <SocialButton variant="outlined" onClick={() => console.log('Apple Login')}>
                      <AppleIcon sx={{ color: '#000' }} />
                    </SocialButton>
                  </Box>
                </Box>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('login.noAccount')}{' '}
                    <Button 
                      onClick={handleRegisterRedirect}
                      sx={{ 
                        textTransform: 'none', 
                        fontWeight: 'bold', 
                        color: BRAND_COLORS.primary,
                        p: 0,
                        minWidth: 'auto',
                        verticalAlign: 'baseline'
                      }}
                    >
                      {t('login.register')}
                    </Button>
                  </Typography>
                </Box>

              </Box>

              {/* Hata Mesajı Snackbar */}
              <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={() => setError('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%', borderRadius: 2 }}>
                  {error}
                </Alert>
              </Snackbar>

            </LoginForm>
          </FormContainer>

          {/* Sağ Görsel Alanı - İllüstrasyon */}
          <ImageContainer>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: 4,
                borderRadius: 4,
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
                },
              }}
            >
              <img 
                src={login2Illustration} 
                alt="Analytics & Accounting Illustration" 
                style={{ 
                  width: '100%', 
                  maxWidth: '400px', 
                  height: 'auto',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
                }}
              />
              <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 800, textAlign: 'center', mt: 3, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                {t('login.hero2Title')}
              </Typography>
              <Typography variant="h6" sx={{ color: '#E3F2FD', textAlign: 'center', mt: 2, fontWeight: 500 }}>
                {t('login.hero2Subtitle')}
              </Typography>
            </Box>
          </ImageContainer>

        </LoginSection>
      </LoginContent>
      </Box>
    </PageContainer>
  );
};

export default Login;