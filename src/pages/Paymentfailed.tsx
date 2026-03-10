import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Typography, Button, Container, AppBar, Toolbar } from '@mui/material';
import ErrorIcon       from '@mui/icons-material/Error';
import ReplayIcon      from '@mui/icons-material/Replay';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
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

// Yaygın hata kodları için Türkçe mesajlar
const ERROR_MESSAGES: Record<string, string> = {
  '51':  'Kartınızda yeterli limit bulunmuyor.',
  '05':  'İşlem bankanız tarafından reddedildi.',
  '14':  'Kart numarası hatalı.',
  '54':  'Kartınızın son kullanma tarihi geçmiş.',
  '57':  'Bu kart bu tür işlemler için kullanılamaz.',
  '61':  'Kart haftalık işlem limitini aştı.',
  '65':  'Kart günlük işlem sayısı limitini aştı.',
  '91':  'Bankanız şu anda hizmet veremiyor, lütfen tekrar deneyin.',
  '96':  'Sistem hatası, lütfen tekrar deneyin.',
};

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId   = searchParams.get('orderId')   ?? '';
  const errorCode = searchParams.get('errorCode') ?? '';
  const errorMsg  = ERROR_MESSAGES[errorCode] ?? 'Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin.';

  return (
    <PageContainer>
      <StyledAppBar position="static">
        <Toolbar>
          <img src={logoImage} alt="FGS Trade" style={{ height: 85, cursor: 'pointer', objectFit: 'contain' }} onClick={() => navigate('/')} />
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <Box sx={{ bgcolor: 'rgba(255,255,255,0.97)', borderRadius: 4, p: { xs: 4, sm: 6 }, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', width: '100%' }}>

          {/* Hata ikonu */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'inline-flex', p: 2.5, borderRadius: '50%', bgcolor: '#ffebee', mb: 1 }}>
              <ErrorIcon sx={{ fontSize: 64, color: '#f44336' }} />
            </Box>
          </Box>

          <Typography variant="h4" fontWeight="bold" sx={{ color: '#c62828', mb: 1 }}>
            Ödeme Başarısız
          </Typography>
          <Typography variant="h6" sx={{ color: '#555', mb: 3, fontWeight: 400 }}>
            {errorMsg}
          </Typography>

          {/* Hata detayı */}
          {(orderId || errorCode) && (
            <Box sx={{ bgcolor: '#fff3e0', borderRadius: 2, p: 2, mb: 4, border: '1px solid #ffcc80', textAlign: 'left' }}>
              {orderId && (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#e65100', mb: 0.5 }}>
                  Sipariş No: {orderId}
                </Typography>
              )}
              {errorCode && (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#e65100' }}>
                  Hata Kodu: {errorCode}
                </Typography>
              )}
            </Box>
          )}

          {/* Öneriler */}
          <Box sx={{ bgcolor: '#f5f5f5', borderRadius: 2, p: 2.5, mb: 4, textAlign: 'left' }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: '#1565C0' }}>
              Ne yapabilirsiniz?
            </Typography>
            {[
              'Kart bilgilerinizi kontrol edin',
              'Farklı bir kart ile tekrar deneyin',
              'Bankanızı arayarak limit kontrolü yapın',
              'Sorun devam ederse destek ekibimizle iletişime geçin',
            ].map((item, i) => (
              <Typography key={i} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                • {item}
              </Typography>
            ))}
          </Box>

          {/* Butonlar */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<ReplayIcon />}
              onClick={() => navigate('/#packages')}
              sx={{
                background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                borderRadius: 2, fontWeight: 700, py: 1.5,
                boxShadow: '0 4px 15px rgba(21,101,192,0.4)',
                '&:hover': { background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)', transform: 'translateY(-2px)' },
              }}
            >
              Tekrar Dene
            </Button>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<SupportAgentIcon />}
              onClick={() => navigate('/#contact')}
              sx={{
                borderColor: '#1565C0', color: '#1565C0', borderRadius: 2,
                fontWeight: 700, py: 1.5,
                '&:hover': { bgcolor: '#e3f2fd', borderColor: '#0D47A1' },
              }}
            >
              Destek Al
            </Button>
          </Box>
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

export default PaymentFailed;