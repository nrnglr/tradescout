import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Link } from 'react-router-dom';

const CartDrawer: React.FC = () => {
  const { 
    items, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    clearCart, 
    totalPrice,
    billingPeriod,
    setBillingPeriod
  } = useCart();
  const { language } = useLanguage();
  
  // Sözleşme onay durumları
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [salesAccepted, setSalesAccepted] = useState(false);

  const allAccepted = termsAccepted && privacyAccepted && salesAccepted;

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      tr: {
        cartTitle: 'Sepetim',
        emptyCart: 'Sepetiniz boş',
        emptyCartDesc: 'Paketlerimizden birini seçerek başlayın',
        total: 'Toplam',
        checkout: 'Ödeme Yap',
        clearCart: 'Sepeti Temizle',
        monthly: 'Aylık',
        yearly: 'Yıllık',
        billingPeriod: 'Ödeme Dönemi',
        securePayment: 'Güvenli ödeme ile devam et',
        perMonth: '/ay',
        perYear: '/yıl',
        savePercent: '%45 tasarruf',
        termsLabel: 'Kullanım Şartları',
        privacyLabel: 'Gizlilik Sözleşmesi',
        salesLabel: 'Mesafeli Satış Sözleşmesi',
        readAndAccept: 'okudum ve kabul ediyorum',
        acceptRequired: 'Devam etmek için tüm sözleşmeleri onaylayın',
      },
      en: {
        cartTitle: 'My Cart',
        emptyCart: 'Your cart is empty',
        emptyCartDesc: 'Start by choosing one of our packages',
        total: 'Total',
        checkout: 'Checkout',
        clearCart: 'Clear Cart',
        monthly: 'Monthly',
        yearly: 'Yearly',
        billingPeriod: 'Billing Period',
        securePayment: 'Continue with secure payment',
        perMonth: '/month',
        perYear: '/year',
        savePercent: 'Save 45%',
        termsLabel: 'Terms of Use',
        privacyLabel: 'Privacy Policy',
        salesLabel: 'Distance Sales Agreement',
        readAndAccept: 'I have read and accept',
        acceptRequired: 'Please accept all agreements to continue',
      }
    };
    return translations[language]?.[key] || key;
  };

  const handleCheckout = () => {
    // iyzico entegrasyonu burada yapılacak
    console.log('Checkout başlatılıyor...', { items, totalPrice, billingPeriod });
    // TODO: iyzico ödeme sayfasına yönlendir
    alert(language === 'tr' 
      ? 'iyzico ödeme entegrasyonu yakında aktif olacak!' 
      : 'iyzico payment integration coming soon!');
  };

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={closeCart}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          bgcolor: '#f8fafc',
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: '#1565C0', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCartIcon />
          <Typography variant="h6" fontWeight="bold">
            {t('cartTitle')}
          </Typography>
          {items.length > 0 && (
            <Chip 
              label={items.length} 
              size="small" 
              sx={{ bgcolor: 'white', color: '#1565C0', fontWeight: 'bold' }} 
            />
          )}
        </Box>
        <IconButton onClick={closeCart} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Billing Period Toggle */}
      {items.length > 0 && (
        <Box sx={{ p: 2, bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('billingPeriod')}
          </Typography>
          <ToggleButtonGroup
            value={billingPeriod}
            exclusive
            onChange={(_, value) => value && setBillingPeriod(value)}
            fullWidth
            size="small"
          >
            <ToggleButton value="monthly" sx={{ textTransform: 'none' }}>
              {t('monthly')}
            </ToggleButton>
            <ToggleButton value="yearly" sx={{ textTransform: 'none' }}>
              {t('yearly')}
              <Chip 
                label={t('savePercent')} 
                size="small" 
                sx={{ ml: 1, bgcolor: '#4caf50', color: 'white', fontSize: '0.7rem' }} 
              />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {/* Cart Items */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {items.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            color: 'text.secondary'
          }}>
            <ShoppingCartIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {t('emptyCart')}
            </Typography>
            <Typography variant="body2">
              {t('emptyCartDesc')}
            </Typography>
          </Box>
        ) : (
          <List>
            {items.map((item) => {
              const displayPrice = billingPeriod === 'yearly' ? item.yearlyPrice : item.price;
              const periodText = billingPeriod === 'yearly' ? t('perYear') : t('perMonth');
              
              return (
                <ListItem
                  key={item.id}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                    mb: 1,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: 2,
                  }}
                >
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" color="#1565C0">
                        {item.name}
                      </Typography>
                      <Chip 
                        label={item.searchLimit} 
                        size="small" 
                        sx={{ mt: 0.5, bgcolor: '#e3f2fd', color: '#1565C0' }} 
                      />
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => removeFromCart(item.id)}
                      sx={{ color: '#f44336' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box sx={{ width: '100%', mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography variant="h6" fontWeight="bold" color="#1565C0">
                      ${displayPrice}{periodText}
                    </Typography>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>

      {/* Footer with Total and Checkout */}
      {items.length > 0 && (
        <Box sx={{ 
          p: 2, 
          bgcolor: 'white', 
          borderTop: '1px solid #e0e0e0',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              {t('total')}
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="#1565C0">
              ${totalPrice}{billingPeriod === 'yearly' ? t('perYear') : t('perMonth')}
            </Typography>
          </Box>

          {/* Sözleşme Onayları */}
          <Box sx={{ 
            bgcolor: '#f5f5f5', 
            borderRadius: 2, 
            p: 1.5, 
            mb: 2,
            border: !allAccepted ? '1px solid #ffb74d' : '1px solid #4caf50'
          }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={termsAccepted} 
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  size="small"
                  sx={{ color: '#1565C0', '&.Mui-checked': { color: '#1565C0' } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                  <Link 
                    to="/kullanim-sartlari" 
                    onClick={closeCart}
                    style={{ color: '#1565C0', fontWeight: 'bold' }}
                  >
                    {t('termsLabel')}
                  </Link>
                  {language === 'tr' ? "'nı " : " "}{t('readAndAccept')}
                </Typography>
              }
              sx={{ m: 0, width: '100%' }}
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={privacyAccepted} 
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  size="small"
                  sx={{ color: '#1565C0', '&.Mui-checked': { color: '#1565C0' } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                  <Link 
                    to="/gizlilik" 
                    onClick={closeCart}
                    style={{ color: '#1565C0', fontWeight: 'bold' }}
                  >
                    {t('privacyLabel')}
                  </Link>
                  {language === 'tr' ? "'ni " : " "}{t('readAndAccept')}
                </Typography>
              }
              sx={{ m: 0, width: '100%' }}
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={salesAccepted} 
                  onChange={(e) => setSalesAccepted(e.target.checked)}
                  size="small"
                  sx={{ color: '#1565C0', '&.Mui-checked': { color: '#1565C0' } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                  <Link 
                    to="/mesafeli-satis" 
                    onClick={closeCart}
                    style={{ color: '#1565C0', fontWeight: 'bold' }}
                  >
                    {t('salesLabel')}
                  </Link>
                  {language === 'tr' ? "'ni " : " "}{t('readAndAccept')}
                </Typography>
              }
              sx={{ m: 0, width: '100%' }}
            />
          </Box>

          {!allAccepted && (
            <Typography variant="caption" color="warning.main" sx={{ display: 'block', textAlign: 'center', mb: 1 }}>
              ⚠️ {t('acceptRequired')}
            </Typography>
          )}
          
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<PaymentIcon />}
            onClick={handleCheckout}
            disabled={!allAccepted}
            sx={{
              bgcolor: allAccepted ? '#1565C0' : '#bdbdbd',
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: allAccepted ? '0 4px 12px rgba(21, 101, 192, 0.4)' : 'none',
              '&:hover': {
                bgcolor: allAccepted ? '#0D47A1' : '#bdbdbd',
                transform: allAccepted ? 'translateY(-2px)' : 'none',
                boxShadow: allAccepted ? '0 6px 16px rgba(21, 101, 192, 0.5)' : 'none',
              },
              '&.Mui-disabled': {
                bgcolor: '#e0e0e0',
                color: '#9e9e9e',
              }
            }}
          >
            {t('checkout')}
          </Button>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
            🔒 {t('securePayment')}
          </Typography>
          
          <Button
            variant="text"
            fullWidth
            size="small"
            onClick={clearCart}
            sx={{ mt: 1, color: 'text.secondary' }}
          >
            {t('clearCart')}
          </Button>
        </Box>
      )}
    </Drawer>
  );
};

export default CartDrawer;
