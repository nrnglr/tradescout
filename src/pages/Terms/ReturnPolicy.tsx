import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';

const ReturnPolicy: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: 4 }}>
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: '#1565C0' }}
        >
          {t('back')}
        </Button>

        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: '#1565C0', mb: 3 }}
          >
            İptal ve İade Şartları
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            1. Genel Bilgi
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            FGS Trade üzerinden alınan abonelikler ve krediler dijital hizmet kapsamında olup, 
            hizmetin kullanımı (arama yapılması, rapor indirilmesi) ile birlikte "Anında İfa 
            Edilen Hizmetler" sınıfına girer.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            2. Kullanılmış Krediler
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            Kullanımı gerçekleşmiş kredilerin iadesi mümkün değildir. Her arama işlemi ve 
            indirilen rapor, kredi kullanımı olarak sayılmaktadır.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            3. Cayma Hakkı
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            Abonelik satın alımı sonrası hiçbir işlem yapmamış kullanıcılar, satın alma 
            tarihinden itibaren 14 gün içerisinde cayma hakkını kullanabilirler. Cayma 
            hakkı kullanımı için info@fgstrade.com adresine e-posta gönderilmesi gerekmektedir.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            4. Abonelik İptali
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            Abonelik iptalleri bir sonraki fatura dönemi için geçerli olur ve mevcut dönem 
            sonuna kadar hizmet kullanımı devam eder. İptal işlemi hesap ayarlarından veya 
            destek ekibimize ulaşarak gerçekleştirilebilir.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            5. İade Süreci
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            Cayma hakkı kapsamında yapılan iade talepleri, talebinizin onaylanmasından 
            itibaren 10 iş günü içerisinde ödemenin yapıldığı yönteme iade edilecektir. 
            İyzico altyapısı kullanıldığından, iade işlemleri güvenli bir şekilde 
            gerçekleştirilmektedir.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            6. İletişim
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#555' }}>
            İade ve iptal işlemleriniz için:
            <br />
            <strong>E-posta:</strong> info@fgstrade.com
            <br />
            <strong>Telefon:</strong> 0554 199 13 27
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="body2" sx={{ color: '#888', textAlign: 'center' }}>
            Son güncelleme: Mart 2026
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ReturnPolicy;
