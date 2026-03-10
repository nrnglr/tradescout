import React, { useState } from 'react';
import {
  Drawer, Box, Typography, IconButton, Button, List, ListItem,
  Chip, ToggleButton, ToggleButtonGroup, Checkbox, FormControlLabel,
  CircularProgress, Radio, RadioGroup, FormControl, Paper,
} from '@mui/material';
import CloseIcon        from '@mui/icons-material/Close';
import DeleteIcon       from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon      from '@mui/icons-material/Payment';
import CreditCardIcon   from '@mui/icons-material/CreditCard';
import { useCart }      from '../context/CartContext';
import { useLanguage }  from '../i18n/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient }    from '../services/api';

// ─── Tosla Paket Kodları ──────────────────────────────────────────────────────
const PLAN_MAP: Record<string, { code: string; priceUsd: number; maxInstallment: number; isYearly: boolean }> = {
  starter_monthly:  { code: '1274715', priceUsd: 15,  maxInstallment: 1,  isYearly: false },
  pro_monthly:      { code: '1274739', priceUsd: 39,  maxInstallment: 1,  isYearly: false },
  business_monthly: { code: '1274779', priceUsd: 79,  maxInstallment: 1,  isYearly: false },
  starter_yearly:   { code: '1274716', priceUsd: 99,  maxInstallment: 12, isYearly: true  },
  pro_yearly:       { code: '1274740', priceUsd: 299, maxInstallment: 12, isYearly: true  },
  business_yearly:  { code: '1274780', priceUsd: 599, maxInstallment: 12, isYearly: true  },
  credit_10:        { code: '1274710', priceUsd: 10,  maxInstallment: 1,  isYearly: false },
  credit_25:        { code: '1274725', priceUsd: 20,  maxInstallment: 1,  isYearly: false },
  credit_50:        { code: '1274750', priceUsd: 35,  maxInstallment: 1,  isYearly: false },
  credit_100:       { code: '1247100', priceUsd: 60,  maxInstallment: 1,  isYearly: false },
};

// ⚠️ TEST FİYATLARI (TL karşılığı değil, gösterim için USD)
// Starter aylık: 1 TL → backend PriceTry=100, frontend sadece gösterim
// Starter yıllık: 2 TL → backend PriceTry=200
// Canlıya geçince: starter: 15, starter yearly: 99 yap
const MONTHLY_PRICES: Record<string, number> = { starter: 15, basic: 39, pro: 39, professional: 39, business: 79 };
const YEARLY_PRICES:  Record<string, number> = { starter: 99, basic: 299, pro: 299, professional: 299, business: 599 };

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
  const [installmentChoice,  setInstallmentChoice]  = useState<'1' | '9' | '12'>('1');

  const allAccepted = termsAccepted && privacyAccepted && salesAccepted;

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
    noInstallment:    'Aylık planlarda taksit uygulanmaz',
    installmentTitle: 'Taksit Seçeneği',
    singlePayment:    'Tek seferlik',
    perInstallment:   '/taksit',
    securePayment:    'Güvenli ödeme · Tosla Sanal POS',
    readAndAccept:    'okudum ve kabul ediyorum',
    acceptRequired:   'Devam etmek için tüm sözleşmeleri onaylayın',
    billingPeriod:    'Ödeme Dönemi',
    bankNote:         'Taksitler bankanız tarafından uygulanır. Toplam tutar değişmez.',
    approx:           'Aylık yaklaşık',
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
    noInstallment:    'No installments for monthly plans',
    installmentTitle: 'Installment Option',
    singlePayment:    'Single payment',
    perInstallment:   '/mo',
    securePayment:    'Secure payment · Tosla Virtual POS',
    readAndAccept:    'I have read and accept',
    acceptRequired:   'Please accept all agreements to continue',
    billingPeriod:    'Billing Period',
    bankNote:         'Installments are applied by your bank. Total amount does not change.',
    approx:           'Approx.',
  };
  const t = (key: string) => (language === 'tr' ? tr : en)[key] ?? key;

  const isLoggedIn = () => !!localStorage.getItem('token');

  // Frontend'den gelen kısa isimleri normalize et
  // "professional" → "pro", "enterprise" → "enterprise" vb.
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

  const totalPrice        = items.reduce((sum, item) => sum + getPlanInfo(item).priceUsd, 0);
  const hasYearly         = items.some(item => getPlanInfo(item).isYearly);
  const selectedInstallment = hasYearly ? parseInt(installmentChoice) : 1;

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
      const plan        = getPlanInfo(items[0]);
      const installment = plan.isYearly ? selectedInstallment : 1;

      const response = await apiClient.post('/api/payment/initialize', {
        productCode: plan.code,
        installment,
        amount:   plan.priceUsd,
        currency: 'USD',
      });

      const paymentUrl = response.data?.paymentUrl ?? response.data?.redirectUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error('Payment URL alınamadı');
      }
    } catch (error: any) {
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
            onChange={(_, val) => { if (val) { setBillingPeriod(val); setInstallmentChoice('1'); } }}
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
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box sx={{ width: '100%', mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <Typography variant="h6" fontWeight="bold" color="#1565C0">
                        ${plan.priceUsd}{plan.isYearly ? t('perYear') : t('perMonth')}
                      </Typography>
                    </Box>
                  </ListItem>
                );
              })}
            </List>

            {/* ── Taksit Seçimi (yalnızca yıllık paket seçiliyse) ──────── */}
            {hasYearly ? (
              <Paper elevation={0} sx={{ borderRadius: 2, border: '2px solid #1565C0', p: 2, mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <CreditCardIcon sx={{ color: '#1565C0', fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight="bold" color="#1565C0">
                    {t('installmentTitle')}
                  </Typography>
                </Box>

                <FormControl component="fieldset" fullWidth>
                  <RadioGroup value={installmentChoice} onChange={e => setInstallmentChoice(e.target.value as '1' | '9' | '12')}>
                    {[
                      { value: '1',  label: t('singlePayment'), months: 1  },
                      { value: '9',  label: language === 'tr' ? '9 Taksit'  : '9 Installments',  months: 9  },
                      { value: '12', label: language === 'tr' ? '12 Taksit' : '12 Installments', months: 12 },
                    ].map(opt => {
                      const isSelected  = installmentChoice === opt.value;
                      const perMonth    = opt.months > 1 ? (totalPrice / opt.months).toFixed(2) : null;

                      return (
                        <Box
                          key={opt.value}
                          onClick={() => setInstallmentChoice(opt.value as '1' | '9' | '12')}
                          sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            p: 1.5, mb: 1, borderRadius: 2, cursor: 'pointer',
                            bgcolor: isSelected ? '#1565C0' : 'white',
                            border: `2px solid ${isSelected ? '#1565C0' : '#e0e0e0'}`,
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: '#1565C0', bgcolor: isSelected ? '#1565C0' : '#f0f4ff' },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Radio
                              value={opt.value}
                              size="small"
                              sx={{ p: 0, color: isSelected ? 'white' : '#1565C0', '&.Mui-checked': { color: 'white' } }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight="bold" sx={{ color: isSelected ? 'white' : '#333' }}>
                                {opt.label}
                              </Typography>
                              {perMonth && (
                                <Typography variant="caption" sx={{ color: isSelected ? 'rgba(255,255,255,.75)' : 'text.secondary' }}>
                                  {t('approx')} ${perMonth}{t('perInstallment')}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          <Typography variant="subtitle2" fontWeight="bold" sx={{ color: isSelected ? 'white' : '#1565C0' }}>
                            {opt.months === 1 ? `$${totalPrice}` : `${opt.months} × $${perMonth}`}
                          </Typography>
                        </Box>
                      );
                    })}
                  </RadioGroup>
                </FormControl>

                <Typography variant="caption" sx={{ color: '#777', display: 'block', mt: 0.5 }}>
                  💳 {t('bankNote')}
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ mt: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="caption" color="text.secondary">ℹ️ {t('noInstallment')}</Typography>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Footer */}
      {items.length > 0 && (
        <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e0e0e0', boxShadow: '0 -4px 12px rgba(0,0,0,.1)', flexShrink: 0 }}>
          {/* Toplam */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}>
            <Typography variant="h6">{t('total')}</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h5" fontWeight="bold" color="#1565C0">
                ${totalPrice}{hasYearly ? t('perYear') : t('perMonth')}
              </Typography>
              {hasYearly && selectedInstallment > 1 && (
                <Typography variant="caption" color="text.secondary">
                  {selectedInstallment} × ${(totalPrice / selectedInstallment).toFixed(2)}{t('perInstallment')}
                </Typography>
              )}
            </Box>
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