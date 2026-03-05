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

const Privacy: React.FC = () => {
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
            Gizlilik Sözleşmesi ve KVKK Aydınlatma Metni
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            1. Veri Sorumlusu
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            FGS Trade olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") 
            kapsamında veri sorumlusu sıfatıyla kişisel verilerinizi işlemekteyiz.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            2. Toplanan Veriler
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            FGS Trade, kullanıcılarına ait aşağıdaki verileri toplamaktadır:
            <br /><br />
            • <strong>Kimlik Bilgileri:</strong> Ad, soyad, e-posta adresi
            <br />
            • <strong>İletişim Bilgileri:</strong> Telefon numarası, adres
            <br />
            • <strong>Şirket Bilgileri:</strong> Şirket adı
            <br />
            • <strong>Kullanım Verileri:</strong> Arama geçmişi, rapor indirme kayıtları
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            3. Veri Güvenliği
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            FGS Trade, kullanıcılarına ait verileri güvenli sunucularda şifrelenmiş olarak 
            saklar. SSL/TLS şifreleme teknolojisi kullanılarak veri transferi güvence altına 
            alınmaktadır. Verileriniz, yetkisiz erişimlere karşı güçlü güvenlik duvarları 
            ve şifreleme protokolleri ile korunmaktadır.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            4. Verilerin Kullanım Amacı
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            Toplanan veriler sadece aşağıdaki amaçlarla kullanılır:
            <br /><br />
            • Hizmet kalitesini artırmak ve kişiselleştirilmiş deneyim sunmak
            <br />
            • Yasal bildirimler ve fatura işlemleri için
            <br />
            • Müşteri desteği sağlamak
            <br />
            • Güvenlik ve dolandırıcılık önleme
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            5. Üçüncü Taraf Paylaşımı
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            Kullanıcı verileri üçüncü taraflarla ticari amaçla paylaşılmaz. Yalnızca yasal 
            zorunluluklar ve hizmet sağlayıcılar (ödeme altyapısı, sunucu hizmetleri) ile 
            gerekli minimum düzeyde paylaşım yapılabilir.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            6. Ödeme Bilgileri
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            Ödeme bilgileri doğrudan iyzico altyapısında saklanmakta olup, tarafımızca 
            kredi kartı bilgisi tutulmamaktadır. iyzico, PCI DSS sertifikasına sahip 
            güvenilir bir ödeme kuruluşudur.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            7. Kullanıcı Hakları
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            KVKK kapsamında kullanıcılarımız aşağıdaki haklara sahiptir:
            <br /><br />
            • Kişisel verilerinin işlenip işlenmediğini öğrenme
            <br />
            • İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme
            <br />
            • Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme
            <br />
            • Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme
            <br />
            • Kişisel verilerin silinmesini veya yok edilmesini isteme
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            8. İletişim
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#555' }}>
            KVKK kapsamındaki talepleriniz için:
            <br />
            <strong>E-posta:</strong> info@fgstrade.com
            <br />
            <strong>Adres:</strong> İstanbul, Türkiye
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

export default Privacy;
