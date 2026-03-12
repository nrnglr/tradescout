import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Typography, Button, Container, AppBar, Toolbar, CircularProgress, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DashboardIcon   from '@mui/icons-material/Dashboard';
import logoImage       from '../assent/fgs-logo.png';
import { apiClient } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

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
  const { language } = useLanguage();
  const orderId = searchParams.get('orderId') ?? '';
  
  const [countdown, setCountdown] = useState(5);
  const [verifying, setVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Ödeme doğrulama
  useEffect(() => {
    if (!orderId) {
      setError(language === 'tr' ? 'Sipariş numarası bulunamadı' : 'Order ID not found');
      setVerifying(false);
      return;
    }

    verifyPayment(orderId);
  }, [orderId, language]);

  const verifyPayment = async (orderId: string) => {
    try {
      console.log('🔍 Ödeme doğrulanıyor...', orderId);
      
      const response = await apiClient.post(`/api/payment/verify/${orderId}`, {}, {
        timeout: 30000 // 30 saniye
      });

      console.log('✅ Ödeme doğrulandı:', response.data);
      setVerificationResult(response.data);
      setVerifying(false);

      // Başarılıysa geri sayımı başlat
      if (response.data.success) {
        // Kullanıcı bilgilerini güncelle (localStorage)
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (response.data.creditsAdded) {
          user.credits = (user.credits || 0) + response.data.creditsAdded;
        }
        if (response.data.packageName) {
          user.packageType = response.data.packageName;
        }
        localStorage.setItem('user', JSON.stringify(user));
      }

    } catch (err: any) {
      console.error('❌ Ödeme doğrulama hatası:', err);
      setError(err.response?.data?.message || (language === 'tr' ? 'Ödeme doğrulanamadı' : 'Payment verification failed'));
      setVerifying(false);
    }
  };

  // Geri sayım
  useEffect(() => {
    if (verifying || error || !verificationResult?.success) return;
    if (countdown <= 0) { navigate('/dashboard'); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate, verifying, error, verificationResult]);

  return (
    <PageContainer>
      <StyledAppBar position="static">
        <Toolbar>
          <img src={logoImage} alt="FGS Trade" style={{ height: 85, cursor: 'pointer', objectFit: 'contain' }} onClick={() => navigate('/')} />
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <Box sx={{ bgcolor: 'rgba(255,255,255,0.97)', borderRadius: 4, p: { xs: 4, sm: 6 }, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', width: '100%' }}>

          {/* Doğrulama Aşaması */}
          {verifying && (
            <>
              <CircularProgress size={80} thickness={4} sx={{ color: '#1565C0', mb: 3 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#1565C0', mb: 2 }}>
                {language === 'tr' ? 'Ödemeniz Doğrulanıyor...' : 'Verifying Your Payment...'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {language === 'tr' ? 'Lütfen bekleyin, bu işlem birkaç saniye sürebilir.' : 'Please wait, this may take a few seconds.'}
              </Typography>
            </>
          )}

          {/* Hata Durumu */}
          {!verifying && error && (
            <>
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                <ErrorIcon sx={{ fontSize: 80, color: '#d32f2f' }} />
              </Box>
              
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#d32f2f', mb: 2 }}>
                {language === 'tr' ? 'Ödeme Başarısız' : 'Payment Failed'}
              </Typography>
              
              <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                {error}
              </Alert>

              {orderId && (
                <Typography variant="body2" sx={{ mb: 3, fontFamily: 'monospace', bgcolor: '#f5f5f5', p: 1.5, borderRadius: 2, color: 'text.secondary' }}>
                  {language === 'tr' ? 'Sipariş No' : 'Order ID'}: {orderId}
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/pricing')}
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                  {language === 'tr' ? 'Paket Seçimine Dön' : 'Back to Packages'}
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => verifyPayment(orderId)}
                  sx={{
                    background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                    borderRadius: 2, fontWeight: 700,
                  }}
                >
                  {language === 'tr' ? 'Tekrar Dene' : 'Retry'}
                </Button>
              </Box>
            </>
          )}

          {/* Başarılı Durum */}
          {!verifying && !error && verificationResult?.success && (
            <>
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                <CircularProgress variant="determinate" value={((5 - countdown) / 5) * 100} size={110} thickness={3} sx={{ color: '#4caf50' }} />
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 60, color: '#4caf50' }} />
                </Box>
              </Box>

              <Typography variant="h4" fontWeight="bold" sx={{ color: '#1565C0', mb: 1 }}>
                {language === 'tr' ? 'Ödeme Başarılı!' : 'Payment Successful!'} 🎉
              </Typography>

              {verificationResult.isAlreadyProcessed ? (
                <Typography variant="h6" sx={{ color: '#ff9800', mb: 2, fontWeight: 600 }}>
                  {language === 'tr' ? 'Bu ödeme daha önce işlenmiş' : 'This payment was already processed'}
                </Typography>
              ) : (
                <Typography variant="h6" sx={{ color: '#2e7d32', mb: 2, fontWeight: 600 }}>
                  {language === 'tr' ? 'Üyeliğiniz aktif edildi.' : 'Your membership has been activated.'}
                </Typography>
              )}

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {language === 'tr' ? 'Ödemeniz başarıyla alındı ve hesabınız güncellendi.' : 'Your payment was successfully received and your account has been updated.'}
              </Typography>

              {/* Ödeme Detayları */}
              <Box sx={{ bgcolor: '#f5f5f5', borderRadius: 2, p: 2.5, mb: 3, textAlign: 'left' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  {language === 'tr' ? 'Sipariş No' : 'Order ID'}
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 600, mb: 2 }}>
                  {verificationResult.orderId}
                </Typography>

                {verificationResult.packageName && (
                  <>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      {language === 'tr' ? 'Paket' : 'Package'}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1565C0', mb: 2 }}>
                      {verificationResult.packageName}
                    </Typography>
                  </>
                )}

                {verificationResult.creditsAdded > 0 && (
                  <>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      {language === 'tr' ? 'Eklenen Kredi' : 'Credits Added'}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#4caf50' }}>
                      +{verificationResult.creditsAdded}
                    </Typography>
                  </>
                )}

                {verificationResult.membershipEnd && (
                  <>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, mt: 2 }}>
                      {language === 'tr' ? 'Üyelik Bitiş Tarihi' : 'Membership End Date'}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {new Date(verificationResult.membershipEnd).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </>
                )}
              </Box>

              <Box sx={{ bgcolor: '#e8f5e9', borderRadius: 2, p: 2, mb: 3, border: '1px solid #c8e6c9' }}>
                <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                  ⏱ {countdown} {language === 'tr' ? 'saniye içinde dashboard\'a yönlendiriliyorsunuz...' : 'seconds until redirect to dashboard...'}
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
                {language === 'tr' ? 'Hemen Dashboard\'a Git' : 'Go to Dashboard Now'}
              </Button>
            </>
          )}

        </Box>
      </Container>

      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          🔒 256-bit SSL {language === 'tr' ? 'ile güvenli ödeme' : 'secure payment'} · Tosla Sanal POS
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default PaymentSuccess;