import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box, TextField, Button, Typography, CircularProgress, Paper, 
  InputAdornment, Snackbar, Alert, IconButton, Divider
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { authService } from '../services/auth';
// Logo import - FGSTrade
import logoImage from '../assent/fgs-logo.png';

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
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(180deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
  },
}));

const RegisterForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5, 4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 24,
  maxWidth: 480,
  width: '100%',
  boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2),
    borderRadius: 16,
    maxWidth: '100%',
  },
}));

const Logo = styled('img')(({ theme }) => ({
  width: 130,
  height: 130,
  borderRadius: 20,
  marginBottom: 20,
  objectFit: 'cover',
  boxShadow: '0 8px 24px rgba(21, 101, 192, 0.3)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  [theme.breakpoints.down('sm')]: {
    width: 90,
    height: 90,
    borderRadius: 14,
    marginBottom: 15,
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

// --- COMPONENT ---
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    companyName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      {/* Arka plan dekoratif elemanlar */}
      <Box sx={{ position: 'absolute', top: 50, left: 50, opacity: 0.05 }}>
        <RocketLaunchIcon sx={{ fontSize: 200, color: 'white' }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: 50, right: 50, opacity: 0.05 }}>
        <VerifiedUserIcon sx={{ fontSize: 200, color: 'white' }} />
      </Box>

      <RegisterForm elevation={5}>
        {/* Geri Dön Butonu */}
        <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
          <IconButton 
            onClick={() => navigate('/login')}
            sx={{ 
              bgcolor: 'rgba(21, 101, 192, 0.1)',
              '&:hover': { bgcolor: 'rgba(21, 101, 192, 0.2)' }
            }}
          >
            <ArrowBackIcon sx={{ color: BRAND_COLORS.primary }} />
          </IconButton>
        </Box>

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
            mb: 1,
            background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          FGS Trade
        </Typography>

        <Typography 
          variant="h6" 
          sx={{ 
            color: '#666', 
            mb: 1,
            fontWeight: 600
          }}
        >
          Hesap Oluştur
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
              5 Ücretsiz Arama
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
              Hızlı Başlangıç
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ width: '100%', mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit} width="100%">
          <StyledTextField
            fullWidth label="Ad Soyad" name="fullName"
            value={formData.fullName} onChange={handleChange}
            InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon color="action"/></InputAdornment>) }}
          />
          <StyledTextField
            fullWidth label="E-Posta" name="email" type="email"
            value={formData.email} onChange={handleChange}
            InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon color="action"/></InputAdornment>) }}
          />
          <StyledTextField
            fullWidth label="Şifre" name="password" type="password"
            value={formData.password} onChange={handleChange}
            InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon color="action"/></InputAdornment>) }}
          />
          <StyledTextField
            fullWidth label="Firma Adı (Opsiyonel)" name="companyName"
            value={formData.companyName} onChange={handleChange}
            InputProps={{ startAdornment: (<InputAdornment position="start"><BusinessIcon color="action"/></InputAdornment>) }}
          />

          <ActionButton type="submit" fullWidth variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Hesap Oluştur'}
          </ActionButton>

          {/* Giriş Yap Linki */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Zaten hesabınız var mı?{' '}
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
                Giriş Yap
              </Button>
            </Typography>
          </Box>
        </Box>
        
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
        </Snackbar>
        <Snackbar open={success} autoHideDuration={6000}>
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            Kayıt Başarılı! Giriş sayfasına yönlendiriliyorsunuz...
          </Alert>
        </Snackbar>
      </RegisterForm>
    </PageContainer>
  );
};

export default Register;
