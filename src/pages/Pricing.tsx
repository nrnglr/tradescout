import React, { useState } from 'react';
import {
  Box, Container, Typography, Button, Card, CardContent,
  Chip, Switch, List, ListItem, ListItemIcon, ListItemText,
  AppBar, Toolbar, IconButton, CircularProgress, Snackbar, Alert, Divider,
} from '@mui/material';
import { styled }           from '@mui/material/styles';
import CheckCircleIcon      from '@mui/icons-material/CheckCircle';
import StarIcon             from '@mui/icons-material/Star';
import RocketLaunchIcon     from '@mui/icons-material/RocketLaunch';
import BusinessIcon         from '@mui/icons-material/Business';
import BoltIcon             from '@mui/icons-material/Bolt';
import ArrowBackIcon        from '@mui/icons-material/ArrowBack';
import LocalOfferIcon       from '@mui/icons-material/LocalOffer';
import CreditScoreIcon      from '@mui/icons-material/CreditScore';
import { useNavigate }      from 'react-router-dom';
import { useLanguage }      from '../i18n/LanguageContext';
import { apiClient }        from '../services/api';

// ─── Tosla Paket Kodları (backend ToslaPaymentService ile BİREBİR AYNI) ──────
const PLANS = {
  // Aylık (taksit yok)
  starter_monthly:  { code: '1274715', price: 15,  yearly: false, installment: 1  },
  pro_monthly:      { code: '1274739', price: 39,  yearly: false, installment: 1  },
  business_monthly: { code: '1274779', price: 79,  yearly: false, installment: 1  },
  // Yıllık (9 veya 12 taksit)
  starter_yearly:   { code: '1274716', price: 99,  yearly: true,  installment: 12 },
  pro_yearly:       { code: '1274740', price: 299, yearly: true,  installment: 12 },
  business_yearly:  { code: '1274780', price: 599, yearly: true,  installment: 12 },
} as const;

// Extra kredi paketleri
const CREDITS = [
  { code: '1274710', label: '10 Kredi',  labelEn: '10 Credits',  price: 10 },
  { code: '1274725', label: '25 Kredi',  labelEn: '25 Credits',  price: 20 },
  { code: '1274750', label: '50 Kredi',  labelEn: '50 Credits',  price: 35 },
  { code: '1247100', label: '100 Kredi', labelEn: '100 Credits', price: 60 },
];

// ─── Styled ───────────────────────────────────────────────────────────────────
const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a1628 0%, #1a365d 50%, #0a1628 100%)',
  position: 'relative', overflow: 'hidden',
  '&::before': {
    content: '""', position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'radial-gradient(circle at 20% 80%, rgba(59,130,246,.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147,51,234,.15) 0%, transparent 50%)',
  },
});

const PricingCard = styled(Card)<{ featured?: string }>(({ featured }) => ({
  background: featured === 'true'
    ? 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)'
    : 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px)',
  borderRadius: 24,
  border: featured === 'true' ? '2px solid rgba(147,51,234,.5)' : '1px solid rgba(255,255,255,.1)',
  transition: 'all .3s ease', position: 'relative', overflow: 'visible',
  '&:hover': { transform: 'translateY(-8px)', boxShadow: featured === 'true' ? '0 25px 50px rgba(124,58,237,.4)' : '0 20px 40px rgba(0,0,0,.3)' },
}));

const PriceTag = styled(Typography)({
  fontSize: '3.5rem', fontWeight: 800, lineHeight: 1,
  background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
});

const BuyBtn = styled(Button)<{ featured?: string }>(({ featured }) => ({
  borderRadius: 12, padding: '14px 32px', fontSize: '1rem', fontWeight: 700, textTransform: 'none',
  background: featured === 'true'
    ? 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)'
    : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  color: featured === 'true' ? '#1e40af' : '#fff',
  '&:hover': { transform: 'scale(1.02)' },
  '&:disabled': { background: '#475569', color: '#94a3b8' },
}));

// ─── Paket tanımları (UI) ────────────────────────────────────────────────────
interface PkgDef {
  key: 'starter' | 'pro' | 'business';
  name: string; nameEn: string;
  icon: React.ReactNode;
  monthlyPrice: number; yearlyPrice: number;
  savePct: number;
  features: string[]; featuresEn: string[];
  featured?: boolean;
  cta: string; ctaEn: string;
}

const pkgDefs: PkgDef[] = [
  {
    key: 'starter', name: 'Başlangıç', nameEn: 'Starter',
    icon: <StarIcon sx={{ fontSize: 40 }} />,
    monthlyPrice: 15, yearlyPrice: 99, savePct: 45, // ⚠️ TEST: backend 1TL/2TL gönderiyor
    features: [
      '30 gün ücretsiz ürün-ülke analiz raporu*',
      'Firma arama & keşif',
      'Excel & PDF Export',
      'HS Kod Analizi',
      'E-posta Desteği',
    ],
    featuresEn: [
      '30-day free product-country analysis*',
      'Company search & discovery',
      'Excel & PDF Export',
      'HS Code Analysis',
      'Email Support',
    ],
    cta: 'Başla', ctaEn: 'Get Started',
  },
  {
    key: 'pro', name: 'Profesyonel', nameEn: 'Professional',
    icon: <RocketLaunchIcon sx={{ fontSize: 40 }} />,
    monthlyPrice: 39, yearlyPrice: 299, savePct: 36,
    features: [
      '30 gün ücretsiz ürün-ülke analiz raporu*',
      'Gelişmiş firma arama',
      'Excel & PDF Export',
      'Gelişmiş HS Analizi',
      'Pazar Trend Raporları',
      'Öncelikli Destek',
    ],
    featuresEn: [
      '30-day free product-country analysis*',
      'Advanced company search',
      'Excel & PDF Export',
      'Advanced HS Analysis',
      'Market Trend Reports',
      'Priority Support',
    ],
    featured: true,
    cta: "Pro'ya Geç", ctaEn: 'Go Pro',
  },
  {
    key: 'business', name: 'İş', nameEn: 'Business',
    icon: <BusinessIcon sx={{ fontSize: 40 }} />,
    monthlyPrice: 79, yearlyPrice: 599, savePct: 37,
    features: [
      '30 gün ücretsiz ürün-ülke analiz raporu*',
      'Premium firma arama',
      'Excel & PDF Export',
      'Premium HS Analizi',
      'Tam API Erişimi',
      'Özel Hesap Yöneticisi',
      'Özel Entegrasyonlar',
    ],
    featuresEn: [
      '30-day free product-country analysis*',
      'Premium company search',
      'Excel & PDF Export',
      'Premium HS Analysis',
      'Full API Access',
      'Dedicated Account Manager',
      'Custom Integrations',
    ],
    cta: 'Satın Al', ctaEn: 'Buy Now',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
const Pricing: React.FC = () => {
  const navigate       = useNavigate();
  const { language }   = useLanguage();
  const [isYearly, setIsYearly]   = useState(false);
  const [loading,  setLoading]    = useState<string | null>(null);
  const [error,    setError]      = useState<string | null>(null);

  const t = (tr: string, en: string) => language === 'tr' ? tr : en;
  const isLoggedIn = () => !!localStorage.getItem('token');

  // ── Ödeme başlat ──────────────────────────────────────────────────────────
  const handlePurchase = async (productCode: string, installment: number, label: string) => {
    if (!isLoggedIn()) {
      setError(t(
        'Ödeme yapabilmek için giriş yapmanız gerekmektedir.',
        'You need to login to make a payment.'
      ));
      setTimeout(() => navigate('/login?redirect=pricing'), 2000);
      return;
    }

    setLoading(productCode);
    setError(null);

    try {
      const response = await apiClient.post('/api/payment/initialize', {
        productCode,
        installment,
      });

      const paymentUrl = response.data?.paymentUrl ?? response.data?.redirectUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error('Payment URL alınamadı');
      }
    } catch (err: any) {
      console.error('Ödeme hatası:', err);
      setError(err.response?.data?.message || t(
        'Ödeme başlatılırken bir hata oluştu. Lütfen tekrar deneyin.',
        'An error occurred. Please try again.'
      ));
    } finally {
      setLoading(null);
    }
  };

  return (
    <PageContainer>
      {/* AppBar */}
      <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>FGS Trade</Typography>
          <Button color="inherit" onClick={() => navigate('/login')} sx={{ textTransform: 'none', fontWeight: 600 }}>
            {t('Giriş Yap', 'Sign In')}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>

        {/* Başlık */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#fff', mb: 2, fontSize: { xs: '2rem', md: '3.5rem' } }}>
            {t('İşinizi Büyütecek Planı Seçin', 'Choose the Plan That Grows Your Business')}
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,.7)', maxWidth: 600, mx: 'auto', mb: 4 }}>
            {t(
              'Küresel ticaret verilerine erişin, potansiyel müşterilerinizi bulun.',
              'Access global trade data and find potential customers.'
            )}
          </Typography>

          {/* Aylık / Yıllık toggle */}
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2, px: 3, py: 1, borderRadius: 10, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)' }}>
            <Typography sx={{ color: !isYearly ? '#fff' : 'rgba(255,255,255,.5)', fontWeight: 600 }}>
              {t('Aylık', 'Monthly')}
            </Typography>
            <Switch
              checked={isYearly}
              onChange={e => setIsYearly(e.target.checked)}
              sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#8b5cf6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8b5cf6' } }}
            />
            <Typography sx={{ color: isYearly ? '#fff' : 'rgba(255,255,255,.5)', fontWeight: 600 }}>
              {t('Yıllık', 'Yearly')}
            </Typography>
            {isYearly && (
              <Chip
                icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
                label={t("45'e kadar %45 tasarruf", 'Save up to 45%')}
                size="small"
                sx={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', fontWeight: 700, '& .MuiChip-icon': { color: '#fff' } }}
              />
            )}
          </Box>

          {/* Yıllık taksit bilgisi */}
          {isYearly && (
            <Typography variant="body2" sx={{ color: '#fbbf24', mt: 2, fontWeight: 600 }}>
              💳 {t('Yıllık planlarda 9 veya 12 taksit seçeneği mevcuttur.', 'Installment options (9 or 12 months) available for annual plans.')}
            </Typography>
          )}
        </Box>

        {/* ── Üyelik Kartları ────────────────────────────────────────────── */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 4, mb: 10 }}>
          {pkgDefs.map(pkg => {
            const planKey  = isYearly ? `${pkg.key}_yearly` : `${pkg.key}_monthly`;
            const plan     = PLANS[planKey as keyof typeof PLANS];
            const price    = isYearly ? pkg.yearlyPrice : pkg.monthlyPrice;
            const isFeatured = !!pkg.featured;

            return (
              <PricingCard key={pkg.key} featured={isFeatured ? 'true' : 'false'}>
                {isFeatured && (
                  <Box sx={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', px: 2.5, py: 0.75, borderRadius: 10, fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(245,158,11,.4)' }}>
                    ⭐ {t('En Popüler', 'Most Popular')}
                  </Box>
                )}
                {isYearly && (
                  <Chip
                    icon={<LocalOfferIcon />}
                    label={`%${pkg.savePct} ${t('indirim', 'off')}`}
                    size="small"
                    sx={{ position: 'absolute', top: -12, right: 20, background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', fontWeight: 700, '& .MuiChip-icon': { color: '#fff' } }}
                  />
                )}

                <CardContent sx={{ p: 4 }}>
                  {/* İkon & İsim */}
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box sx={{ display: 'inline-flex', p: 2, borderRadius: 4, mb: 2, background: isFeatured ? 'rgba(255,255,255,.2)' : 'rgba(59,130,246,.2)', color: isFeatured ? '#fff' : '#3b82f6' }}>
                      {pkg.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                      {language === 'tr' ? pkg.name : pkg.nameEn}
                    </Typography>
                  </Box>

                  {/* Fiyat */}
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                      <Typography sx={{ color: 'rgba(255,255,255,.6)', fontSize: '1.5rem', mr: 0.5 }}>$</Typography>
                      <PriceTag>{price}</PriceTag>
                    </Box>
                    <Typography sx={{ color: 'rgba(255,255,255,.5)', fontSize: '0.9rem' }}>
                      {isYearly ? t('/yıl', '/year') : t('/ay', '/month')}
                    </Typography>
                    {isYearly && (
                      <Typography sx={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600, mt: 0.5 }}>
                        {t(`Aylık sadece $${Math.round(price / 12)}`, `Only $${Math.round(price / 12)}/month`)}
                      </Typography>
                    )}
                    {isYearly && (
                      <Typography sx={{ color: '#fbbf24', fontSize: '0.78rem', mt: 0.5 }}>
                        {t('9 veya 12 taksit seçeneği', '9 or 12 installments available')}
                      </Typography>
                    )}
                    {!isYearly && (
                      <Typography sx={{ color: 'rgba(255,255,255,.4)', fontSize: '0.78rem', mt: 0.5 }}>
                        {t('Taksit yok', 'No installments')}
                      </Typography>
                    )}
                  </Box>

                  {/* Özellikler */}
                  <List sx={{ mb: 3 }}>
                    {(language === 'tr' ? pkg.features : pkg.featuresEn).map((f, i) => (
                      <ListItem key={i} disableGutters sx={{ py: 0.75 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ color: isFeatured ? '#a5f3fc' : '#10b981', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText primary={f} primaryTypographyProps={{ sx: { color: 'rgba(255,255,255,.85)', fontSize: '0.9rem' } }} />
                      </ListItem>
                    ))}
                  </List>

                  {/* Buton */}
                  <BuyBtn
                    fullWidth
                    featured={isFeatured ? 'true' : 'false'}
                    onClick={() => handlePurchase(plan.code, isYearly ? 12 : 1, `${language === 'tr' ? pkg.name : pkg.nameEn} ${isYearly ? t('Yıllık','Yearly') : t('Aylık','Monthly')}`)}
                    disabled={loading === plan.code}
                  >
                    {loading === plan.code
                      ? <CircularProgress size={24} color="inherit" />
                      : (language === 'tr' ? pkg.cta : pkg.ctaEn)}
                  </BuyBtn>
                </CardContent>
              </PricingCard>
            );
          })}
        </Box>

        {/* ── Notlar ─────────────────────────────────────────────────────── */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,.4)', fontSize: '0.8rem' }}>
            * {t(
              '30 gün ücretsiz ürün-ülke analiz raporu özelliği geliştirme aşamasındadır. 30 gün sonra 1 ürün + 1 ülke analizi = 5 kredi.',
              '30-day free product-country analysis is under development. After 30 days: 1 product + 1 country = 5 credits.'
            )}
          </Typography>
        </Box>

        {/* ── Extra Kredi Paketleri ──────────────────────────────────────── */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', textAlign: 'center', mb: 1 }}>
            {t('Ekstra Kredi Satın Al', 'Buy Extra Credits')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,.6)', textAlign: 'center', mb: 4 }}>
            {t(
              'Üyeliğinize ek kredi ekleyin. Krediler süresiz geçerlidir. Taksit uygulanmaz.',
              'Add extra credits to your membership. Credits never expire. No installments.'
            )}
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' }, gap: 3 }}>
            {CREDITS.map(cr => (
              <Card key={cr.code} sx={{ background: 'rgba(255,255,255,.05)', backdropFilter: 'blur(20px)', borderRadius: 3, border: '1px solid rgba(255,255,255,.1)', transition: 'all .3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(0,0,0,.3)' } }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <CreditScoreIcon sx={{ fontSize: 40, color: '#3b82f6', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                    {language === 'tr' ? cr.label : cr.labelEn}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#3b82f6', mb: 0.5 }}>
                    ${cr.price}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.4)', display: 'block', mb: 2 }}>
                    {t('Taksit yok · Süresiz', 'No installments · Never expires')}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    onClick={() => handlePurchase(cr.code, 1, cr.label)}
                    disabled={loading === cr.code}
                    sx={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                  >
                    {loading === cr.code
                      ? <CircularProgress size={20} color="inherit" />
                      : t('Satın Al', 'Buy Now')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Trust */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,.5)', mb: 1 }}>
            🔒 {t('256-bit SSL ile güvenli ödeme · Tosla Sanal POS', 'Secure payment with 256-bit SSL · Tosla Virtual POS')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,.5)' }}>
            {t('Sorularınız için: destek@fgstrade.com', 'Questions? Contact: destek@fgstrade.com')}
          </Typography>
        </Box>
      </Container>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default Pricing;