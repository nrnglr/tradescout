import React from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../i18n/LanguageContext';

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
          
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<PaymentIcon />}
            onClick={handleCheckout}
            sx={{
              bgcolor: '#1565C0',
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(21, 101, 192, 0.4)',
              '&:hover': {
                bgcolor: '#0D47A1',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(21, 101, 192, 0.5)',
              },
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
