import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer, Box, Typography, IconButton, Button, List, ListItem,
  Chip, ToggleButton, ToggleButtonGroup, Checkbox, FormControlLabel,
  CircularProgress, Paper, TextField, InputAdornment, Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PaymentIcon from '@mui/icons-material/Payment';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';

// ─── Tosla Paket Kodları ──────────────────────────────────────────────────────
const PLAN_MAP: Record<string, { code: string; priceUsd: number; priceTry: number; maxInstallment: number; isYearly: boolean }> = {
  starter_monthly:  { code: '1274715', priceUsd: 7.5,   priceTry: 336,   maxInstallment: 1,  isYearly: false },
  pro_monthly:      { code: '1274739', priceUsd: 19.5,  priceTry: 874,   maxInstallment: 1,  isYearly: false },
  business_monthly: { code: '1274779', priceUsd: 39.5,  priceTry: 1772,  maxInstallment: 1,  isYearly: false },
  starter_yearly:   { code: '1274716', priceUsd: 49.5,  priceTry: 2221,  maxInstallment: 12, isYearly: true  },
  pro_yearly:       { code: '1274740', priceUsd: 149.5, priceTry: 6708,  maxInstallment: 12, isYearly: true  },
  business_yearly:  { code: '1274780', priceUsd: 299.5, priceTry: 13438, maxInstallment: 12, isYearly: true  },
  credit_10:        { code: '1274710', priceUsd: 10,    priceTry: 430,   maxInstallment: 1,  isYearly: false },
  credit_25:        { code: '1274725', priceUsd: 20,    priceTry: 860,   maxInstallment: 1,  isYearly: false },
  credit_50:        { code: '1274750', priceUsd: 35,    priceTry: 1505,  maxInstallment: 1,  isYearly: false },
  credit_100:       { code: '1247100', priceUsd: 60,    priceTry: 2580,  maxInstallment: 1,  isYearly: false },
};

const MONTHLY_PRICES: Record<string, number> = { starter: 7.5, basic: 19.5, pro: 19.5, professional: 19.5, business: 39.5 };
const YEARLY_PRICES:  Record<string, number> = { starter: 49.5, basic: 149.5, pro: 149.5, professional: 149.5, business: 299.5 };

// TL/USD Dönüşüm Oranı
const USD_TO_TRY = 45; // 1 USD = 45 TRY

// ─────────────────────────────────────────────────────────────────────────────
const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { items, isCartOpen, closeCart, removeFromCart, clearCart, billingPeriod, setBillingPeriod } = useCart();
  const { language } = useLanguage();

  const [termsAccepted,      setTermsAccepted]      = useState(false);
  const [privacyAccepted,    setPrivacyAccepted]    = useState(false);
  const [salesAccepted,      setSalesAccepted]      = useState(false);
  const [isProcessing,       setIsProcessing]       = useState(false);
  const [paymentError,       setPaymentError]       = useState<string | null>(null);
  const [isAuthenticated,    setIsAuthenticated]    = useState(false);
  const [currency,           setCurrency]           = useState<'TRY' | 'USD'>('USD'); // Para birimi seçimi
  
  // İndirim kodu state'leri
  const [discountCode,       setDiscountCode]       = useState('');
  const [discountData,       setDiscountData]       = useState<any>(null);
  const [discountLoading,    setDiscountLoading]    = useState(false);
  const [discountError,      setDiscountError]      = useState('');

  const allAccepted = termsAccepted && privacyAccepted && salesAccepted;

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const newAuthState = !!token;
      
      if (newAuthState !== isAuthenticated) {
        setIsAuthenticated(newAuthState);
        if (newAuthState && paymentError) {
          setPaymentError(null);
        }
      }
    };

    checkAuth();
    if (isCartOpen) checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isCartOpen, isAuthenticated, paymentError]);

  // Sepet değiştiğinde indirim kodunu sıfırla
  useEffect(() => {
    if (discountData) {
      removeDiscountCode();
    }
  }, [items.length, billingPeriod]); // items.length veya billingPeriod değişince indirim sıfırlanır

  const isLoggedIn = () => isAuthenticated;

  const tr: Record<string, string> = {
    cartTitle:        'Sepetim',
    emptyCart:        'Sepetiniz boş',
    emptyCartDesc:    'Paketlerimizden birini seçerek başlayın',
    total:            'Toplam',
    checkout:         'Ödeme Yap',
    clearCart:        'Sepeti Temizle',
    monthly:          'Aylık',
    yearly:           'Yıllık',
    perMonth:         '/ay',
    perYear:          '/yıl',
    saveLabel:        '%45 tasarruf',
    securePayment:    'Güvenli ödeme · Morpara Sanal POS',
    readAndAccept:    'okudum ve kabul ediyorum',
    acceptRequired:   'Devam etmek için tüm sözleşmeleri onaylayın',
    billingPeriod:    'Ödeme Dönemi',
    goToPackages:     'Paketlere Git',
  };
  const en: Record<string, string> = {
    cartTitle:        'My Cart',
    emptyCart:        'Your cart is empty',
    emptyCartDesc:    'Start by choosing one of our packages',
    total:            'Total',
    checkout:         'Checkout',
    clearCart:        'Clear Cart',
    monthly:          'Monthly',
    yearly:           'Yearly',
    perMonth:         '/month',
    perYear:          '/year',
    saveLabel:        'Save 45%',
    securePayment:    'Secure payment · Morpara Sanal POS',
    readAndAccept:    'I have read and accept',
    acceptRequired:   'Please accept all agreements to continue',
    billingPeriod:    'Billing Period',
    goToPackages:     'Go to Packages',
  };
  const t = (key: string) => (language === 'tr' ? tr : en)[key] ?? key;

  const normalizeId = (id: string): string => {
    const map: Record<string, string> = {
      professional: 'pro',
      starter:      'starter',
      basic:        'basic',
      pro:          'pro',
      business:     'business',
      enterprise:   'enterprise',
      ultimate:     'ultimate',
    };
    const clean = id.replace('_monthly','').replace('_yearly','').toLowerCase();
    return map[clean] ?? clean;
  };

  const getPlanInfo = (item: typeof items[0]) => {
    const rawId    = item.id.toLowerCase();
    const isCredit = rawId.startsWith('credit');

    if (isCredit) {
      const plan = PLAN_MAP[rawId] ?? PLAN_MAP[item.id];
      return { code: plan?.code ?? item.id, priceUsd: plan?.priceUsd ?? item.price, isYearly: false };
    }

    const baseId  = normalizeId(rawId);
    const planKey = billingPeriod === 'yearly' ? `${baseId}_yearly` : `${baseId}_monthly`;
    const plan    = PLAN_MAP[planKey];
    const price   = billingPeriod === 'yearly'
      ? (YEARLY_PRICES[baseId]  ?? item.yearlyPrice ?? item.price)
      : (MONTHLY_PRICES[baseId] ?? item.price);

    return { code: plan?.code ?? item.id, priceUsd: price, isYearly: billingPeriod === 'yearly' };
  };

  const totalPrice = items.reduce((sum, item) => {
    const plan = getPlanInfo(item);
    return sum + plan.priceUsd;
  }, 0);
  const hasYearly  = items.some(item => getPlanInfo(item).isYearly);
  
  // Fiyat formatı — currency seçimine göre
  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  // Seçilen currency'e göre fiyat
  const getPriceForCurrency = (item: typeof items[0]) => {
    const plan = getPlanInfo(item);
    return plan.priceUsd;
  };
  
  // İndirim kodunu kaldır
  const removeDiscountCode = () => {
    setDiscountCode('');
    setDiscountData(null);
    setDiscountError('');
  };
  
  // İndirim kodu doğrulama fonksiyonu
  const validateDiscountCode = async () => {
    if (!discountCode.trim()) {
      setDiscountError(language === 'tr' ? 'Lütfen bir indirim kodu girin' : 'Please enter a discount code');
      return;
    }
    
    if (items.length === 0) {
      setDiscountError(language === 'tr' ? 'Sepetinizde ürün bulunmuyor' : 'Your cart is empty');
      return;
    }
    
    setDiscountLoading(true);
    setDiscountError('');
    
    try {
      // İlk ürünün paket bilgisini al
      const plan = getPlanInfo(items[0]);
      
      // Backend'in tam olarak beklediği paket kodunu gönder
      // Örnek: starter_monthly, pro_yearly, credit_10 gibi
      const rawId = items[0].id.toLowerCase();
      let packageCode = rawId;
      
      // Eğer kredi paketi değilse, billing period'a göre paket kodu oluştur
      if (!rawId.startsWith('credit')) {
        const baseId = normalizeId(rawId);
        packageCode = billingPeriod === 'yearly' ? `${baseId}_yearly` : `${baseId}_monthly`;
      }
      
      console.log('🏷️ İndirim kodu doğrulanıyor:', {
        code: discountCode.trim().toUpperCase(),
        packageCode,
        originalPrice: totalPrice
      });
      
      const response = await apiClient.post('/api/discountcode/validate', {
        code: discountCode.trim().toUpperCase(),
        packageCode: packageCode,
        originalPrice: totalPrice // USD cinsinden fiyat
      });
      
      console.log('✅ Backend response:', response.data);
      
      if (response.data.isValid) {
        setDiscountData(response.data);
        setDiscountError('');
      } else {
        setDiscountError(response.data.message || (language === 'tr' ? 'İndirim kodu geçersiz' : 'Invalid discount code'));
        setDiscountData(null);
      }
    } catch (err: any) {
      console.error('❌ İndirim kodu hatası:', err);
      const errorMsg = err.response?.data?.message || 
        (language === 'tr' ? 'İndirim kodu doğrulanırken bir hata oluştu' : 'Error validating discount code');
      setDiscountError(errorMsg);
      setDiscountData(null);
    } finally {
      setDiscountLoading(false);
    }
  };
  
  // Final fiyat hesaplama (indirim varsa)
  // Backend'den gelen response: { discountedPrice, originalPrice, discountPercentage, discountAmount }
  const finalPrice = discountData?.discountedPrice ?? totalPrice;
{/* Toplam Fiyat Bölümü Güncellemesi */}
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}>
  <Typography variant="h6">{t('total')}</Typography>
  <Box sx={{ textAlign: 'right' }}>
    {discountData && (
      <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
        ${totalPrice}
      </Typography>
    )}
    <Typography variant="h5" fontWeight="bold" color="#1565C0">
      ${finalPrice}{hasYearly ? t('perYear') : t('perMonth')}
    </Typography>
    {discountData && (
      <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold', display: 'block' }}>
        %{discountData.discountPercentage} {language === 'tr' ? 'İndirim Uygulandı' : 'Discount Applied'}
      </Typography>
    )}
  </Box>
</Box>
  const handleCheckout = async () => {
    if (!isLoggedIn()) {
      setPaymentError(language === 'tr'
        ? 'Ödeme yapabilmek için giriş yapmanız gerekmektedir.'
        : 'You need to login to make a payment.');
      setTimeout(() => { closeCart(); navigate('/login?redirect=checkout'); }, 2000);
      return;
    }
    if (!allAccepted || items.length === 0) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const plan = getPlanInfo(items[0]);
      
      const paymentData: any = {
        productCode: plan.code,
        installment: 1,
        amount: finalPrice,
        currency: currency, // 'TRY' veya 'USD'
      };
      
      // İndirim kodu varsa backend'e gönder (kullanıcının girdiği kodu gönderiyoruz)
      if (discountData && discountCode) {
        paymentData.discountCode = discountCode.trim().toUpperCase();
      }

      console.log('💳 Ödeme başlatılıyor:', paymentData);

      const isYearly = items.some(i => getPlanInfo(i).isYearly);
      const isCredit = items.some(i => i.id.toLowerCase().startsWith('credit'));
      const endpoint = '/api/payment/morpara/initialize';
      const response = await apiClient.post(endpoint, paymentData);

      const paymentUrl = response.data?.paymentUrl ?? response.data?.redirectUrl;
      if (paymentUrl) {
        console.log('✅ Ödeme URL alındı, yönlendiriliyor...');
        window.location.href = paymentUrl;
      } else {
        throw new Error('Payment URL alınamadı');
      }
    } catch (error: any) {
      console.error('❌ Ödeme hatası:', error);
      if (error.response?.status === 401) {
        setPaymentError(language === 'tr' ? 'Oturum süreniz dolmuş.' : 'Session expired. Please login again.');
        setTimeout(() => { closeCart(); navigate('/login?redirect=checkout'); }, 2000);
        return;
      }
      setPaymentError(error.response?.data?.message ??
        (language === 'tr' ? 'Ödeme başlatılırken hata oluştu.' : 'Payment error. Please try again.'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={closeCart}
      PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' } }}
    >
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: '#1565C0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCartIcon />
          <Typography variant="h6" fontWeight="bold">{t('cartTitle')}</Typography>
          {items.length > 0 && (
            <Chip label={items.length} size="small" sx={{ bgcolor: 'white', color: '#1565C0', fontWeight: 'bold' }} />
          )}
        </Box>
        <IconButton onClick={closeCart} sx={{ color: 'white' }}><CloseIcon /></IconButton>
      </Box>

      {/* Aylık / Yıllık toggle */}
      {items.some(i => !i.id.startsWith('credit')) && (
        <Box sx={{ p: 2, bgcolor: '#e3f2fd', flexShrink: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
            {t('billingPeriod')}
          </Typography>
          <ToggleButtonGroup
            value={billingPeriod} exclusive
            onChange={(_, val) => { if (val) { setBillingPeriod(val); } }}
            size="small" fullWidth
          >
            <ToggleButton value="monthly" sx={{ fontWeight: 600 }}>{t('monthly')}</ToggleButton>
            <ToggleButton value="yearly"  sx={{ fontWeight: 600 }}>
              {t('yearly')}
              <Chip label={t('saveLabel')} size="small" sx={{ ml: 1, bgcolor: '#4caf50', color: 'white', fontSize: '0.6rem', height: 18 }} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {/* İçerik */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <ShoppingCartIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" gutterBottom>{t('emptyCart')}</Typography>
            <Typography variant="body2">{t('emptyCartDesc')}</Typography>
          </Box>
        ) : (
          <>
            {/* Ürün listesi */}
            <List disablePadding>
              {items.map(item => {
                const plan = getPlanInfo(item);
                return (
                  <ListItem key={item.id} sx={{ bgcolor: 'white', borderRadius: 2, mb: 1.5, boxShadow: '0 1px 3px rgba(0,0,0,.1)', flexDirection: 'column', alignItems: 'flex-start', p: 2 }}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" color="#1565C0">{item.name}</Typography>
                        {plan.isYearly && (
                          <Chip label={language === 'tr' ? 'Yıllık' : 'Yearly'} size="small"
                            sx={{ mt: 0.5, bgcolor: '#fff3e0', color: '#e65100', fontWeight: 600, fontSize: '0.7rem' }} />
                        )}
                      </Box>
                      <IconButton size="small" onClick={() => removeFromCart(item.id)} sx={{ color: '#f44336' }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box sx={{ width: '100%', mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <Typography variant="h6" fontWeight="bold" color="#1565C0">
                        {formatPrice(plan.priceUsd)}{plan.isYearly ? t('perYear') : t('perMonth')}
                      </Typography>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </>
        )}
      </Box>

      {/* Footer */}
      {items.length > 0 && (
        <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e0e0e0', boxShadow: '0 -4px 12px rgba(0,0,0,.1)', flexShrink: 0 }}>
          {/* Toplam Fiyat */}
          <Box sx={{ mb: 1.5 }}>
            {discountData ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {language === 'tr' ? 'Ara Toplam' : 'Subtotal'}
                  </Typography>
                  <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                    ${discountData.originalPrice?.toFixed(2) || totalPrice.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    {language === 'tr' ? 'İndirim' : 'Discount'} ({discountData.discountPercentage}%)
                  </Typography>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    -${discountData.discountAmount?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', pt: 1, borderTop: '2px solid #e0e0e0' }}>
                  <Typography variant="h6" fontWeight="bold">{t('total')}</Typography>
                  <Typography variant="h5" fontWeight="bold" color="#1565C0">
                    ${discountData.discountedPrice?.toFixed(2) || totalPrice.toFixed(2)}{hasYearly ? t('perYear') : t('perMonth')}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography variant="h6">{t('total')}</Typography>
                <Typography variant="h5" fontWeight="bold" color="#1565C0">
                  {formatPrice(totalPrice)}{hasYearly ? t('perYear') : t('perMonth')}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Sözleşmeler */}
          <Box sx={{ bgcolor: '#f5f5f5', borderRadius: 2, p: 1.5, mb: 1.5, border: `1px solid ${allAccepted ? '#4caf50' : '#ffb74d'}` }}>
            {[
              { checked: termsAccepted,   set: setTermsAccepted,   label: language === 'tr' ? 'Kullanım Şartları'         : 'Terms of Use',             to: '/kullanim-sartlari', suffix: language === 'tr' ? "'nı " : ' ' },
              { checked: privacyAccepted, set: setPrivacyAccepted, label: language === 'tr' ? 'Gizlilik Sözleşmesi'       : 'Privacy Policy',           to: '/gizlilik',          suffix: language === 'tr' ? "'ni " : ' ' },
              { checked: salesAccepted,   set: setSalesAccepted,   label: language === 'tr' ? 'Mesafeli Satış Sözleşmesi' : 'Distance Sales Agreement', to: '/mesafeli-satis',    suffix: language === 'tr' ? "'ni " : ' ' },
            ].map(({ checked, set, label, to, suffix }) => (
              <FormControlLabel
                key={to}
                control={<Checkbox checked={checked} onChange={e => set(e.target.checked)} size="small" sx={{ color: '#1565C0', '&.Mui-checked': { color: '#1565C0' } }} />}
                label={
                  <Typography variant="body2" sx={{ fontSize: '0.78rem' }}>
                    <Link to={to} onClick={closeCart} style={{ color: '#1565C0', fontWeight: 'bold' }}>{label}</Link>
                    {suffix}{t('readAndAccept')}
                  </Typography>
                }
                sx={{ m: 0, width: '100%' }}
              />
            ))}
          </Box>

          {!allAccepted && (
            <Typography variant="caption" color="warning.main" sx={{ display: 'block', textAlign: 'center', mb: 1 }}>
              ⚠️ {t('acceptRequired')}
            </Typography>
          )}

          {paymentError && (
            <Box sx={{ bgcolor: '#ffebee', borderRadius: 1, p: 1.5, mb: 1.5, border: '1px solid #ef5350' }}>
              <Typography variant="caption" color="error" sx={{ display: 'block', textAlign: 'center' }}>❌ {paymentError}</Typography>
            </Box>
          )}

          {/* İndirim Kodu Girişi */}
          <Box sx={{ mb: 2 }}>
            {!discountData ? (
              <>
                <TextField
                  variant="outlined" fullWidth size="small"
                  placeholder={language === 'tr' ? 'İndirim kodunuzu girin' : 'Enter your discount code'}
                  value={discountCode}
                  onChange={e => setDiscountCode(e.target.value.toUpperCase())}
                  onKeyPress={e => { if (e.key === 'Enter') validateDiscountCode(); }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalOfferIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                />
                <Button
                  variant="contained" fullWidth size="small"
                  onClick={validateDiscountCode}
                  disabled={discountLoading || !discountCode.trim()}
                  sx={{
                    bgcolor: '#1565C0', py: 1, borderRadius: 2,
                    fontWeight: 'bold', fontSize: '0.875rem',
                    boxShadow: '0 4px 12px rgba(21,101,192,.4)',
                    '&:hover': { bgcolor: '#0D47A1', transform: 'translateY(-2px)' },
                    '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#9e9e9e' },
                  }}
                >
                  {discountLoading ? <CircularProgress size={20} color="inherit" /> : (language === 'tr' ? 'İndirim Kodunu Uygula' : 'Apply Discount Code')}
                </Button>
                {discountError && (
                  <Alert severity="error" sx={{ mt: 1, py: 0 }}>
                    {discountError}
                  </Alert>
                )}
              </>
            ) : (
              <Alert 
                severity="success" 
                icon={<CheckCircleIcon />}
                action={
                  <IconButton size="small" onClick={removeDiscountCode} sx={{ color: 'success.main' }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ mb: 1 }}
              >
                <Typography variant="body2" fontWeight="bold">
                  {language === 'tr' ? `${discountCode} kodu uygulandı` : `Code ${discountCode} applied`}
                </Typography>
                <Typography variant="caption">
                  {discountData.message || (language === 'tr' ? `%${discountData.discountPercentage} indirim kazandınız` : `${discountData.discountPercentage}% discount applied`)}
                </Typography>
              </Alert>
            )}
          </Box>

          <Button
            variant="contained" fullWidth size="large"
            startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
            onClick={handleCheckout}
            disabled={!allAccepted || isProcessing}
            sx={{
              bgcolor: allAccepted ? '#1565C0' : '#bdbdbd', py: 1.5, borderRadius: 2,
              fontWeight: 'bold', fontSize: '1rem',
              boxShadow: allAccepted ? '0 4px 12px rgba(21,101,192,.4)' : 'none',
              '&:hover': { bgcolor: allAccepted ? '#0D47A1' : '#bdbdbd', transform: allAccepted ? 'translateY(-2px)' : 'none' },
              '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#9e9e9e' },
            }}
          >
            {isProcessing ? (language === 'tr' ? 'İşleniyor...' : 'Processing...') : t('checkout')}
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
            🔒 {t('securePayment')}
          </Typography>

          <Button variant="text" fullWidth size="small" onClick={clearCart} disabled={isProcessing} sx={{ mt: 1, color: 'text.secondary' }}>
            {t('clearCart')}
          </Button>
        </Box>
      )}
    </Drawer>
  );
};

export default CartDrawer;