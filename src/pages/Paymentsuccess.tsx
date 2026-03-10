import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Typography, Button, Container, AppBar, Toolbar, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DashboardIcon   from '@mui/icons-material/Dashboard';
import logoImage       from '../assent/fgs-logo.png';

const PageContainer = styled(Box)({
  minHeight: '100vh',
  width: '100%',
  background: 'linear-gradient(180deg, #1565C0 0%, #1976D2 50%, #42A5F5 100%)',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const StyledAppBar = styled(AppBar)({
  background: 'linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(227,242,253,0.95) 30%, rgba(21,101,192,0.95) 50%, rgba(21,101,192,0.95) 100%)',
  boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
  backdropFilter: 'blur(10px)',
});

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') ?? '';
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) { navigate('/dashboard'); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

  return (
    <PageContainer>
      <StyledAppBar position="static">
        <Toolbar>
          <img src={logoImage} alt="FGS Trade" style={{ height: 85, cursor: 'pointer', objectFit: 'contain' }} onClick={() => navigate('/')} />
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <Box sx={{ bgcolor: 'rgba(255,255,255,0.97)', borderRadius: 4, p: { xs: 4, sm: 6 }, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', width: '100%' }}>

          {/* Geri sayım + ikon */}
          <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
            <CircularProgress variant="determinate" value={((5 - countdown) / 5) * 100} size={110} thickness={3} sx={{ color: '#4caf50' }} />
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: '#4caf50' }} />
            </Box>
          </Box>

          <Typography variant="h4" fontWeight="bold" sx={{ color: '#1565C0', mb: 1 }}>
            Ödeme Başarılı! 🎉
          </Typography>
          <Typography variant="h6" sx={{ color: '#2e7d32', mb: 2, fontWeight: 600 }}>
            Üyeliğiniz aktif edildi.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Ödemeniz başarıyla alındı ve hesabınız güncellendi.
          </Typography>

          {orderId && (
            <Typography variant="body2" sx={{ mb: 3, fontFamily: 'monospace', bgcolor: '#f5f5f5', p: 1.5, borderRadius: 2, color: 'text.secondary' }}>
              Sipariş No: {orderId}
            </Typography>
          )}

          <Box sx={{ bgcolor: '#e8f5e9', borderRadius: 2, p: 2, mb: 4, border: '1px solid #c8e6c9' }}>
            <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600 }}>
              ⏱ {countdown} saniye içinde dashboard'a yönlendiriliyorsunuz...
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
              borderRadius: 2, fontWeight: 700, py: 1.5,
              boxShadow: '0 4px 15px rgba(21,101,192,0.4)',
              '&:hover': { background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)', transform: 'translateY(-2px)' },
            }}
          >
            Hemen Dashboard'a Git
          </Button>
        </Box>
      </Container>

      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          🔒 256-bit SSL ile güvenli ödeme · Tosla Sanal POS
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default PaymentSuccess;