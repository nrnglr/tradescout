import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box, TextField, Button, Typography, CircularProgress, Paper, 
  InputAdornment, Snackbar, Alert, IconButton, Divider, MenuItem, Select, FormControl, InputLabel, Container, Toolbar, AppBar
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PublicIcon from '@mui/icons-material/Public';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import HomeIcon from '@mui/icons-material/Home';
import { authService } from '../services/auth';
import { useLanguage } from '../i18n/LanguageContext';
// Logo import - FGSTrade
import logoImage from '../assent/fgs-logo.png';
import loginIllustration from '../assent/login-illustration.png';
import login2Illustration from '../assent/login2-illustration.png';

// --- STİLLER (Login ile aynı) ---
const BRAND_COLORS = {
  primary: '#1565C0',
  primaryHover: '#0D47A1',
  secondary: '#1976D2',
  lightBlue: '#42A5F5',
  gradient: 'linear-gradient(135deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)',
};

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(180deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)',
  position: 'relative',
  overflowY: 'auto',
}));

const RegisterContent = styled(Box)(({ theme }) => ({
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

const RegisterSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '1300px',
  margin: '0 auto',
  gap: theme.spacing(4),
}));

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
  flex: 1.5,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
  maxWidth: '580px',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}));

const RegisterForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5, 4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 24,
  maxWidth: 560,
  width: '100%',
  margin: '0 auto',
  background: 'rgba(255, 255, 255, 0.98)',
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

const ActionButton = styled(Button)({
  marginTop: '16px',
  padding: '14px',
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
});

const StyledSelect = styled(FormControl)(({ theme }) => ({
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
  },
  '& .MuiInputBase-input': {
    padding: '14px 14px !important',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: BRAND_COLORS.primary,
    fontWeight: 600,
  },
}));

// --- COMPONENT ---
const Register = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    companyName: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    website: '',
    userType: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Lütfen zorunlu alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      // Backend'e kayıt isteği at
      await authService.register(formData);
      
      setSuccess(true);
      // 2 saniye sonra Login sayfasına yönlendir
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        <RegisterContent>
          <RegisterSection>
          
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
                alt="Register Illustration" 
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

          {/* Register Form Alanı */}
          <FormContainer>
            <RegisterForm elevation={5}>
              {/* Logo */}
              <Logo 
                src={logoImage} 
                alt="Fortex Globe Logo" 
              />

              {/* Başlık */}
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
                {t('register.title')}
              </Typography>

              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#666', 
                  mb: 4, 
                  fontWeight: 500 
                }}
              >
                {t('register.subtitle')}
              </Typography>

              {/* Avantaj Chip'leri */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5, 
            bgcolor: 'rgba(21, 101, 192, 0.08)', 
            px: 1.5, 
            py: 0.5, 
            borderRadius: 2 
          }}>
              <CardGiftcardIcon sx={{ fontSize: 18, color: BRAND_COLORS.primary }} />
              <Typography variant="caption" fontWeight="600" color={BRAND_COLORS.primary}>
                {t('register.benefit3')}
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              bgcolor: 'rgba(21, 101, 192, 0.08)', 
              px: 1.5, 
              py: 0.5, 
              borderRadius: 2 
            }}>
              <RocketLaunchIcon sx={{ fontSize: 18, color: BRAND_COLORS.primary }} />
              <Typography variant="caption" fontWeight="600" color={BRAND_COLORS.primary}>
                {t('register.benefit1')}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ width: '100%', mb: 3 }} />          <Box component="form" onSubmit={handleSubmit} width="100%">
            <StyledTextField
              fullWidth label={t('register.fullName')} name="fullName"
              value={formData.fullName} onChange={handleChange}
              InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon color="action"/></InputAdornment>) }}
            />
            <StyledTextField
              fullWidth label={t('register.email')} name="email" type="email"
              value={formData.email} onChange={handleChange}
              InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon color="action"/></InputAdornment>) }}
            />
            <StyledTextField
              fullWidth label={t('register.password')} name="password" type="password"
              value={formData.password} onChange={handleChange}
              InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon color="action"/></InputAdornment>) }}
            />
            <StyledTextField
              fullWidth label={t('register.companyName')} name="companyName"
              value={formData.companyName} onChange={handleChange}
              InputProps={{ startAdornment: (<InputAdornment position="start"><BusinessIcon color="action"/></InputAdornment>) }}
            />

            <StyledTextField
              fullWidth label={t('register.address') || 'Adres'} name="address"
              value={formData.address} onChange={handleChange}
              InputProps={{ startAdornment: (<InputAdornment position="start"><LocationOnIcon color="action"/></InputAdornment>) }}
            />
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2.5 }}>
              <StyledTextField
                fullWidth label={t('register.city') || 'Şehir'} name="city"
                value={formData.city} onChange={handleChange}
                InputProps={{ startAdornment: (<InputAdornment position="start"><LocationCityIcon color="action"/></InputAdornment>) }}
              />
              <StyledTextField
                fullWidth label={t('register.country') || 'Ülke'} name="country"
                value={formData.country} onChange={handleChange}
                InputProps={{ startAdornment: (<InputAdornment position="start"><PublicIcon color="action"/></InputAdornment>) }}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2.5 }}>
              <StyledTextField
                fullWidth label={t('register.phone') || 'Telefon'} name="phone"
                value={formData.phone} onChange={handleChange}
                InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon color="action"/></InputAdornment>) }}
              />
              <StyledTextField
                fullWidth label={t('register.website') || 'Web Sitesi'} name="website"
                value={formData.website} onChange={handleChange}
                InputProps={{ startAdornment: (<InputAdornment position="start"><LanguageIcon color="action"/></InputAdornment>) }}
              />
            </Box>

            <StyledSelect fullWidth>
              <InputLabel sx={{ color: '#666' }}>{t('register.userType') || 'Kullanıcı Türü'}</InputLabel>
              <Select
                name="userType"
                value={formData.userType}
                onChange={handleSelectChange}
                label={t('register.userType') || 'Kullanıcı Türü'}
              >
                <MenuItem value="">
                  <em>Seçiniz</em>
                </MenuItem>
                <MenuItem value="manufacturer">{t('register.manufacturer') || 'Üretici'}</MenuItem>
                <MenuItem value="wholesaler">{t('register.wholesaler') || 'Toptancı'}</MenuItem>
                <MenuItem value="researcher">{t('register.researcher') || 'Araştırmacı'}</MenuItem>
              </Select>
            </StyledSelect>

            <ActionButton type="submit" fullWidth variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : t('register.registerButton')}
            </ActionButton>

            {/* Giriş Yap Linki */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('register.haveAccount')}{' '}
                <Button 
                  onClick={() => navigate('/login')}
                  sx={{ 
                    textTransform: 'none', 
                    fontWeight: 'bold', 
                    color: BRAND_COLORS.primary,
                    p: 0,
                    minWidth: 'auto',
                    verticalAlign: 'baseline'
                  }}
                >
                  {t('register.loginNow')}
                </Button>
              </Typography>
            </Box>
          </Box>
          
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
            <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
          </Snackbar>
          <Snackbar open={success} autoHideDuration={6000}>
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              {t('register.successMessage')}
            </Alert>
          </Snackbar>
            </RegisterForm>
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
                alt="Features Illustration" 
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

        </RegisterSection>
      </RegisterContent>
      </Box>
    </PageContainer>
  );
};

export default Register;
