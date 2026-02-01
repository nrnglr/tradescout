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
  IconButton,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple'; // Apple ikonu için
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; // Ticari ikon
import logoImage from '../assent/image.png'; // Logo import
import loginIllustration from '../assent/login-illustration.png'; // Sol panel görseli
import login2Illustration from '../assent/login2-illustration.png'; // Sağ panel görseli
import { authService } from '../services/auth'; // Auth servisi import

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
}));

const Logo = styled('img')({
  width: 120,
  height: 120,
  borderRadius: 24,
  marginBottom: 24,
  objectFit: 'cover',
  boxShadow: '0 8px 24px rgba(21, 101, 192, 0.3)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

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
  
  // State Yönetimi
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Backend URL (Çevre değişkeninden veya statik)
  const API_URL = process.env.REACT_APP_API_URL || 'https://api.siteniz.com';

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
      setError('Lütfen e-posta ve şifrenizi giriniz.');
      return;
    }

    setLoading(true);

    try {
      // GERÇEK BACKEND BAĞLANTISI
      await authService.login({ email, password });
      
      console.log("Login başarılı!");
      
      // Beni Hatırla Mantığı
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Başarılı girişte Dashboard'a yönlendir
      navigate('/dashboard');

    } catch (err: any) {
      console.error("Login hatası:", err);
      setError(err.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.');
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
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(21, 101, 192, 0.3)',
        backdropFilter: 'blur(10px)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img 
            src={logoImage} 
            alt="Trade Scout Logo" 
            style={{ height: '45px', width: 'auto', borderRadius: '12px' }}
          />
          <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            Fortex Globe Search
          </Typography>
        </Box>
        <Button
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{
            color: '#FFFFFF',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            borderRadius: '12px',
            padding: '8px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Ana Sayfa
        </Button>
      </Box>

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
                Potansiyel Müşterilerinizi Bulun
              </Typography>
              <Typography variant="h6" sx={{ color: '#E3F2FD', textAlign: 'center', mt: 2, fontWeight: 500 }}>
                Google Haritalar ile sektörünüzdeki firmaları keşfedin
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
                  mb: 1,
                  background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                FGS
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ color: '#666', mb: 4, fontWeight: 500 }}
              >
                Devam etmek için lütfen giriş yapın
              </Typography>

              <Box component="form" onSubmit={handleSubmit} width="100%">
                <StyledTextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="E-Posta Adresi"
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
                  label="Şifre"
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
                    label={<Typography variant="body2" color="text.secondary">Beni Hatırla</Typography>}
                  />
                  
                  <Button 
                    onClick={handleForgotPassword}
                    sx={{ textTransform: 'none', color: BRAND_COLORS.primary, fontWeight: 600 }}
                  >
                    Şifremi Unuttum?
                  </Button>
                </Box>

                <ActionButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: '#FFFFFF' }} /> : 'Giriş Yap'}
                </ActionButton>

                {/* Sosyal Medya Girişleri */}
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Typography variant="caption" display="block" align="center" color="text.secondary" sx={{ mb: 2 }}>
                    Veya şununla devam et
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
                    Hesabınız yok mu?{' '}
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
                      Kayıt Ol
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
                Mali Analiz & Hesaplama
              </Typography>
              <Typography variant="h6" sx={{ color: '#E3F2FD', textAlign: 'center', mt: 2, fontWeight: 500 }}>
                Finansal raporlarınızı kolayca yönetin
              </Typography>
            </Box>
          </ImageContainer>

        </LoginSection>
      </LoginContent>
    </PageContainer>
  );
};

export default Login;