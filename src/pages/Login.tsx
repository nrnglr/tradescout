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
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
// Logo import - FGSTrade
import logoImage from '../assent/fgs-logo.png';
import loginIllustration from '../assent/login-illustration.png';
import login2Illustration from '../assent/login2-illustration.png';
import { authService } from '../services/auth';
import { useLanguage } from '../i18n/LanguageContext';
import { useGoogleLogin } from '@react-oauth/google';

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

// Sol ve Sağ görsel alanları
const ImageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
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
  const { t, language } = useLanguage();

  // Mod Yönetimi: 'login' | 'forgot' | 'resetCode' | 'verify'
  type ViewMode = 'login' | 'forgot' | 'resetCode' | 'verify';
  const [viewMode, setViewMode] = useState<ViewMode>('login');

  // google ile kayıt yönetimi 
  const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    setLoading(true);
    try {
      // Artık authService içinde bu metod var!
      await authService.googleLogin(tokenResponse.access_token);
      
      // Başarılı olursa yönlendir
      navigate('/dashboard');
    } catch (err: any) {
      setError(language === 'tr' ? 'Google ile giriş başarısız.' : 'Google login failed.');
    } finally {
      setLoading(false);
    }
  },
  onError: () => setError('Google Login Error'),
});
  // State Yönetimi
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sayfa yüklendiğinde "Beni Hatırla" kontrolü
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Login Handler
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('login.errorEmpty'));
      return;
    }

    setLoading(true);

    try {
      await authService.login({ email, password });

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message || t('login.errorFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Şifremi Unuttum Handler - Kod gönder
  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError(language === 'tr' ? 'Lütfen kayıtlı e-posta adresinizi giriniz.' : 'Please enter your registered email address.');
      return;
    }

    setLoading(true);

    try {
      // Backend'e şifre sıfırlama kodu gönder
      await authService.resetPasswordRequest(email);

      setSuccessMsg(language === 'tr'
        ? 'Şifre sıfırlama kodu e-postanıza gönderildi.'
        : 'Password reset code has been sent to your email.');

      // Kod girişi ekranına geç
      setTimeout(() => {
        setViewMode('resetCode');
        setSuccessMsg('');
      }, 2000);

    } catch (err: any) {
      // 404 hatası = backend endpoint'i henüz hazır değil
      if (err.response?.status === 404) {
        setError(language === 'tr'
          ? 'Bu özellik şu anda kullanılamıyor. Lütfen destek ile iletişime geçin.'
          : 'This feature is currently unavailable. Please contact support.');
      } else {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg || (language === 'tr' ? 'İşlem başarısız.' : 'Operation failed.'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Şifre Sıfırlama Handler - Kod ile yeni şifre belirle
  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!verificationCode || verificationCode.length < 6) {
      setError(language === 'tr' ? 'Lütfen 6 haneli kodu giriniz.' : 'Please enter the 6-digit code.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError(language === 'tr' ? 'Şifre en az 6 karakter olmalıdır.' : 'Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(language === 'tr' ? 'Şifreler eşleşmiyor.' : 'Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // Backend'e kod ve yeni şifre gönder
      await authService.resetPassword(email, verificationCode, newPassword);

      setSuccessMsg(language === 'tr'
        ? 'Şifreniz başarıyla değiştirildi! Giriş yapabilirsiniz.'
        : 'Your password has been changed successfully! You can now login.');

      // Alanları temizle
      setVerificationCode('');
      setNewPassword('');
      setConfirmPassword('');

      // 2 saniye sonra login ekranına dön
      setTimeout(() => {
        setViewMode('login');
        setSuccessMsg('');
      }, 2000);

    } catch (err: any) {
      // 404 hatası = backend endpoint'i henüz hazır değil
      if (err.response?.status === 404) {
        setError(language === 'tr'
          ? 'Bu özellik şu anda kullanılamıyor. Lütfen destek ile iletişime geçin.'
          : 'This feature is currently unavailable. Please contact support.');
      } else {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg || (language === 'tr' ? 'Kod hatalı veya süresi dolmuş.' : 'Invalid or expired code.'));
      }
    } finally {
      setLoading(false);
    }
  };

  // E-posta Doğrulama Handler
  const handleVerifyEmail = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!verificationCode || verificationCode.length < 4) {
      setError(language === 'tr' ? 'Lütfen geçerli bir doğrulama kodu giriniz.' : 'Please enter a valid verification code.');
      return;
    }

    setLoading(true);

    try {
      // Backend servisine istek
      await authService.verifyEmail(email, verificationCode);

      setSuccessMsg(language === 'tr'
        ? 'E-posta adresiniz başarıyla doğrulandı! Giriş yapabilirsiniz.'
        : 'Your email has been verified successfully! You can now login.');

      setViewMode('login');
      setVerificationCode('');

    } catch (err: any) {
      // 404 hatası = backend endpoint'i henüz hazır değil
      if (err.response?.status === 404) {
        setError(language === 'tr'
          ? 'Bu özellik şu anda kullanılamıyor. Lütfen destek ile iletişime geçin.'
          : 'This feature is currently unavailable. Please contact support.');
      } else {
        setError(err.response?.data?.message || err.message || (language === 'tr' ? 'Kod hatalı veya süresi dolmuş.' : 'Invalid or expired code.'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Form Submit Handler (Moda göre doğru fonksiyonu çağır)
  const handleSubmit = (e: FormEvent) => {
    if (viewMode === 'login') {
      handleLogin(e);
    } else if (viewMode === 'forgot') {
      handleForgotPassword(e);
    } else if (viewMode === 'resetCode') {
      handleResetPassword(e);
    } else {
      handleVerifyEmail(e);
    }
  };

  // Dinamik başlık ve alt başlık
  const getTitle = () => {
    switch (viewMode) {
      case 'forgot':
        return language === 'tr' ? 'Şifremi Unuttum' : 'Forgot Password';
      case 'resetCode':
        return language === 'tr' ? 'Yeni Şifre Belirleme' : 'Set New Password';
      case 'verify':
        return language === 'tr' ? 'E-posta Doğrulama' : 'Email Verification';
      default:
        return t('login.title');
    }
  };

  const getSubtitle = () => {
    switch (viewMode) {
      case 'forgot':
        return language === 'tr'
          ? 'Şifrenizi sıfırlamak için e-posta adresinizi girin.'
          : 'Enter your email address to reset your password.';
      case 'resetCode':
        return language === 'tr'
          ? `${email} adresine gönderilen kodu ve yeni şifrenizi girin.`
          : `Enter the code sent to ${email} and your new password.`;
      case 'verify':
        return language === 'tr'
          ? `${email} adresine gönderilen kodu girin.`
          : `Enter the code sent to ${email}.`;
      default:
        return t('login.subtitle');
    }
  };

  const getButtonText = () => {
    if (loading) return <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />;

    switch (viewMode) {
      case 'forgot':
        return language === 'tr' ? 'Sıfırlama Kodu Gönder' : 'Send Reset Code';
      case 'resetCode':
        return language === 'tr' ? 'Şifreyi Değiştir' : 'Change Password';
      case 'verify':
        return language === 'tr' ? 'Doğrula' : 'Verify';
      default:
        return t('login.loginButton');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
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

                {/* DİNAMİK BAŞLIKLAR */}
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
                  {getTitle()}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ color: '#666', mb: 4, fontWeight: 500, textAlign: 'center' }}
                >
                  {getSubtitle()}
                </Typography>

                <Box component="form" onSubmit={handleSubmit} width="100%">

                  {/* E-POSTA ALANI (Login ve Şifremi Unuttum'da görünür) */}
                  {(viewMode === 'login' || viewMode === 'forgot') && (
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
                  )}

                  {/* ŞİFRE ALANI (Sadece Login modunda) */}
                  {viewMode === 'login' && (
                    <StyledTextField
                      variant="outlined"
                      fullWidth
                      name="password"
                      label={t('login.password')}
                      type={showPassword ? 'text' : 'password'}
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
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              onClick={() => setShowPassword(!showPassword)}
                              onMouseDown={(e) => e.preventDefault()}
                              sx={{
                                minWidth: 'auto',
                                p: '4px 8px',
                                color: 'action.active',
                                '&:hover': {
                                  backgroundColor: 'rgba(21, 101, 192, 0.08)',
                                },
                                borderRadius: '6px',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {showPassword ? (
                                <VisibilityOffIcon fontSize="small" />
                              ) : (
                                <VisibilityIcon fontSize="small" />
                              )}
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}

                  {/* DOĞRULAMA KODU ALANI (Sadece Verify modunda) */}
                  {viewMode === 'verify' && (
                    <StyledTextField
                      variant="outlined"
                      fullWidth
                      id="verificationCode"
                      label={language === 'tr' ? 'Doğrulama Kodu' : 'Verification Code'}
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <VpnKeyIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        maxLength: 6,
                        style: { letterSpacing: '8px', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }
                      }}
                    />
                  )}

                  {/* ŞİFRE SIFIRLAMA ALANLARI (resetCode modunda) */}
                  {viewMode === 'resetCode' && (
                    <>
                      {/* Sıfırlama Kodu */}
                      <StyledTextField
                        variant="outlined"
                        fullWidth
                        id="resetCode"
                        label={language === 'tr' ? 'Sıfırlama Kodu' : 'Reset Code'}
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <VpnKeyIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          maxLength: 6,
                          style: { letterSpacing: '8px', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }
                        }}
                      />

                      {/* Yeni Şifre */}
                      <StyledTextField
                        variant="outlined"
                        fullWidth
                        name="newPassword"
                        label={language === 'tr' ? 'Yeni Şifre' : 'New Password'}
                        type={showNewPassword ? 'text' : 'password'}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                onMouseDown={(e) => e.preventDefault()}
                                sx={{
                                  minWidth: 'auto',
                                  p: '4px 8px',
                                  color: 'action.active',
                                  '&:hover': {
                                    backgroundColor: 'rgba(21, 101, 192, 0.08)',
                                  },
                                  borderRadius: '6px',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                {showNewPassword ? (
                                  <VisibilityOffIcon fontSize="small" />
                                ) : (
                                  <VisibilityIcon fontSize="small" />
                                )}
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                      />

                      {/* Şifre Tekrar */}
                      <StyledTextField
                        variant="outlined"
                        fullWidth
                        name="confirmPassword"
                        label={language === 'tr' ? 'Şifre Tekrar' : 'Confirm Password'}
                        type={showNewPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </>
                  )}

                  {/* ALT SEÇENEKLER (Sadece Login modunda) */}
                  {viewMode === 'login' && (
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
                        onClick={() => setViewMode('forgot')}
                        sx={{ textTransform: 'none', color: BRAND_COLORS.primary, fontWeight: 600 }}
                      >
                        {t('login.forgotPassword')}
                      </Button>
                    </Box>
                  )}

                  <ActionButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                  >
                    {getButtonText()}
                  </ActionButton>

                  {/* GERİ DÖNÜŞ BUTONU (Login dışındaki modlarda) */}
                  {viewMode !== 'login' && (
                    <Button
                      fullWidth
                      startIcon={<ArrowBackIcon />}
                      onClick={() => {
                        setViewMode('login');
                        setError('');
                        setSuccessMsg('');
                      }}
                      sx={{
                        mt: 1.5,
                        textTransform: 'none',
                        color: 'text.secondary',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: 'rgba(21, 101, 192, 0.05)',
                        }
                      }}
                    >
                      {language === 'tr' ? 'Giriş Ekranına Dön' : 'Back to Login'}
                    </Button>
                  )}

                  {/* Sosyal Medya Girişleri (Sadece Login modunda) */}
                  {viewMode === 'login' && (
                    <Box sx={{ mt: 3, mb: 2 }}>
                      <Typography variant="caption" display="block" align="center" color="text.secondary" sx={{ mb: 2 }}>
                        {t('login.orContinue')}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <SocialButton variant="outlined" onClick={() => googleLogin()}>
                          <GoogleIcon sx={{ color: '#DB4437' }} />
                        </SocialButton>
                       
                      </Box>
                    </Box>
                  )}

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

                {/* Başarı Mesajı Snackbar */}
                <Snackbar
                  open={!!successMsg}
                  autoHideDuration={6000}
                  onClose={() => setSuccessMsg('')}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                  <Alert onClose={() => setSuccessMsg('')} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
                    {successMsg}
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